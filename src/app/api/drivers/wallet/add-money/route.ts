import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { walletTransactions, driverWallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, amount, description, paymentMethod } = body;

    // Validate required fields
    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID is required', code: 'MISSING_DRIVER_ID' },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Amount is required', code: 'MISSING_AMOUNT' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required', code: 'MISSING_PAYMENT_METHOD' },
        { status: 400 }
      );
    }

    // Validate driverId is a valid integer
    const driverIdInt = parseInt(driverId);
    if (isNaN(driverIdInt)) {
      return NextResponse.json(
        { error: 'Driver ID must be a valid integer', code: 'INVALID_DRIVER_ID' },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      return NextResponse.json(
        { error: 'Amount must be a valid number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (amountNum <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (amountNum < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100', code: 'AMOUNT_TOO_LOW' },
        { status: 400 }
      );
    }

    if (amountNum > 50000) {
      return NextResponse.json(
        { error: 'Amount cannot exceed 50000', code: 'AMOUNT_TOO_HIGH' },
        { status: 400 }
      );
    }

    // Validate description
    const trimmedDescription = description.trim();
    if (trimmedDescription.length === 0) {
      return NextResponse.json(
        { error: 'Description cannot be empty', code: 'EMPTY_DESCRIPTION' },
        { status: 400 }
      );
    }

    // Validate paymentMethod
    const validPaymentMethods = ['upi', 'card', 'netbanking', 'wallet'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { 
          error: 'Payment method must be one of: upi, card, netbanking, wallet', 
          code: 'INVALID_PAYMENT_METHOD' 
        },
        { status: 400 }
      );
    }

    // Fetch driver's wallet
    const wallet = await db
      .select()
      .from(driverWallets)
      .where(eq(driverWallets.driverId, driverIdInt))
      .limit(1);

    if (wallet.length === 0) {
      return NextResponse.json(
        { error: 'Driver wallet not found', code: 'WALLET_NOT_FOUND' },
        { status: 404 }
      );
    }

    const currentWallet = wallet[0];
    const newBalance = currentWallet.totalEarnings + amountNum;

    // Generate unique reference number
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referenceNumber = `TXN${timestamp}${randomString}`;

    const createdAt = new Date().toISOString();

    // Create transaction record
    const newTransaction = await db
      .insert(walletTransactions)
      .values({
        driverId: driverIdInt,
        walletId: currentWallet.id,
        type: 'credit',
        amount: amountNum,
        balanceAfter: newBalance,
        description: trimmedDescription,
        referenceNumber: referenceNumber,
        rideId: null,
        status: 'completed',
        createdAt: createdAt,
      })
      .returning();

    // Update driver's wallet
    await db
      .update(driverWallets)
      .set({
        totalEarnings: newBalance,
        updatedAt: createdAt,
      })
      .where(eq(driverWallets.id, currentWallet.id));

    return NextResponse.json(newTransaction[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}