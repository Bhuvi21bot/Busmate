import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { walletTransactions, driverWallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, amount, bankDetails } = body;

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

    if (!amount) {
      return NextResponse.json(
        { 
          error: 'Amount is required',
          code: 'MISSING_AMOUNT' 
        },
        { status: 400 }
      );
    }

    if (!bankDetails) {
      return NextResponse.json(
        { 
          error: 'Bank details are required',
          code: 'MISSING_BANK_DETAILS' 
        },
        { status: 400 }
      );
    }

    // Validate driverId is a valid integer
    const driverIdInt = parseInt(driverId);
    if (isNaN(driverIdInt)) {
      return NextResponse.json(
        { 
          error: 'Driver ID must be a valid integer',
          code: 'INVALID_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { 
          error: 'Amount must be a positive number',
          code: 'INVALID_AMOUNT' 
        },
        { status: 400 }
      );
    }

    // Validate minimum withdrawal amount
    if (amountNum < 500) {
      return NextResponse.json(
        { 
          error: 'Minimum withdrawal amount is 500',
          code: 'AMOUNT_TOO_LOW' 
        },
        { status: 400 }
      );
    }

    // Validate bankDetails object structure
    if (typeof bankDetails !== 'object' || Array.isArray(bankDetails)) {
      return NextResponse.json(
        { 
          error: 'Bank details must be an object',
          code: 'INVALID_BANK_DETAILS_FORMAT' 
        },
        { status: 400 }
      );
    }

    // Validate required bank details fields
    const { accountNumber, ifscCode, accountHolderName, bankName } = bankDetails;

    if (!accountNumber || typeof accountNumber !== 'string' || accountNumber.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Account number is required and must be a non-empty string',
          code: 'INVALID_ACCOUNT_NUMBER' 
        },
        { status: 400 }
      );
    }

    if (!ifscCode || typeof ifscCode !== 'string' || ifscCode.trim() === '') {
      return NextResponse.json(
        { 
          error: 'IFSC code is required and must be a non-empty string',
          code: 'INVALID_IFSC_CODE' 
        },
        { status: 400 }
      );
    }

    // Validate IFSC code format (11 characters, alphanumeric)
    const ifscCodeTrimmed = ifscCode.trim();
    if (ifscCodeTrimmed.length !== 11 || !/^[A-Z0-9]+$/i.test(ifscCodeTrimmed)) {
      return NextResponse.json(
        { 
          error: 'IFSC code must be 11 alphanumeric characters',
          code: 'INVALID_IFSC_FORMAT' 
        },
        { status: 400 }
      );
    }

    if (!accountHolderName || typeof accountHolderName !== 'string' || accountHolderName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Account holder name is required and must be a non-empty string',
          code: 'INVALID_ACCOUNT_HOLDER_NAME' 
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
        { 
          error: 'Driver wallet not found',
          code: 'WALLET_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const driverWallet = wallet[0];

    // Check if wallet has sufficient balance
    if (driverWallet.totalEarnings < amountNum) {
      return NextResponse.json(
        { 
          error: 'Insufficient wallet balance',
          code: 'INSUFFICIENT_BALANCE' 
        },
        { status: 400 }
      );
    }

    // Calculate new balance
    const newBalance = driverWallet.totalEarnings - amountNum;

    // Generate unique reference number
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referenceNumber = `WTH${timestamp}${randomString}`;

    // Prepare bank details for description
    const bankDetailsForDescription = {
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCodeTrimmed,
      accountHolderName: accountHolderName.trim(),
      ...(bankName && { bankName: bankName.trim() })
    };

    const description = `Withdrawal request - Bank Details: ${JSON.stringify(bankDetailsForDescription)}`;

    // Create withdrawal transaction
    const newTransaction = await db
      .insert(walletTransactions)
      .values({
        driverId: driverIdInt,
        walletId: driverWallet.id,
        type: 'withdrawal',
        amount: amountNum,
        balanceAfter: newBalance,
        description,
        referenceNumber,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      .returning();

    // Update driver wallet
    await db
      .update(driverWallets)
      .set({
        totalEarnings: newBalance,
        lastPayoutAmount: amountNum,
        lastPayoutDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(driverWallets.id, driverWallet.id));

    return NextResponse.json(newTransaction[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}