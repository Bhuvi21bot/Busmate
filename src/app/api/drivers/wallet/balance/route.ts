import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driverWallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, amount, operation, updatePending = false } = body;

    // Validate required fields
    if (!driverId) {
      return NextResponse.json(
        { 
          error: 'Driver ID is required',
          code: 'MISSING_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { 
          error: 'Amount is required',
          code: 'MISSING_AMOUNT' 
        },
        { status: 400 }
      );
    }

    if (!operation) {
      return NextResponse.json(
        { 
          error: 'Operation is required',
          code: 'MISSING_OPERATION' 
        },
        { status: 400 }
      );
    }

    // Validate driverId is a valid integer
    const parsedDriverId = parseInt(driverId);
    if (isNaN(parsedDriverId)) {
      return NextResponse.json(
        { 
          error: 'Driver ID must be a valid integer',
          code: 'INVALID_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate amount is a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return NextResponse.json(
        { 
          error: 'Amount must be a valid number',
          code: 'INVALID_AMOUNT' 
        },
        { status: 400 }
      );
    }

    // Validate operation type
    if (operation !== 'add' && operation !== 'subtract') {
      return NextResponse.json(
        { 
          error: 'Operation must be either "add" or "subtract"',
          code: 'INVALID_OPERATION' 
        },
        { status: 400 }
      );
    }

    // Fetch the driver's wallet
    const wallet = await db.select()
      .from(driverWallets)
      .where(eq(driverWallets.driverId, parsedDriverId))
      .limit(1);

    if (wallet.length === 0) {
      return NextResponse.json(
        { 
          error: 'Driver wallet not found',
          code: 'WALLET_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const currentWallet = wallet[0];
    let newTotalEarnings: number;
    let newPendingPayouts: number = currentWallet.pendingPayouts;

    // Calculate new balance based on operation
    if (operation === 'add') {
      newTotalEarnings = currentWallet.totalEarnings + parsedAmount;
      if (updatePending) {
        newPendingPayouts = currentWallet.pendingPayouts + parsedAmount;
      }
    } else {
      // operation === 'subtract'
      // Check if sufficient balance
      if (currentWallet.totalEarnings < parsedAmount) {
        return NextResponse.json(
          { 
            error: 'Insufficient balance to subtract the specified amount',
            code: 'INSUFFICIENT_BALANCE',
            currentBalance: currentWallet.totalEarnings,
            requestedAmount: parsedAmount
          },
          { status: 400 }
        );
      }
      newTotalEarnings = currentWallet.totalEarnings - parsedAmount;
      if (updatePending) {
        // Check if sufficient pending payouts
        if (currentWallet.pendingPayouts < parsedAmount) {
          return NextResponse.json(
            { 
              error: 'Insufficient pending payouts to subtract the specified amount',
              code: 'INSUFFICIENT_PENDING_BALANCE',
              currentPendingPayouts: currentWallet.pendingPayouts,
              requestedAmount: parsedAmount
            },
            { status: 400 }
          );
        }
        newPendingPayouts = currentWallet.pendingPayouts - parsedAmount;
      }
    }

    // Prepare update object
    const updateData: any = {
      totalEarnings: newTotalEarnings,
      updatedAt: new Date().toISOString()
    };

    if (updatePending) {
      updateData.pendingPayouts = newPendingPayouts;
    }

    // Update the wallet
    const updatedWallet = await db.update(driverWallets)
      .set(updateData)
      .where(eq(driverWallets.driverId, parsedDriverId))
      .returning();

    if (updatedWallet.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update wallet',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedWallet[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}