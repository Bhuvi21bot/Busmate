import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customerWallets, customerWalletTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { amount, paymentMethod, description } = body;

    // Validate required fields
    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Amount is required', code: 'MISSING_AMOUNT' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required', code: 'MISSING_PAYMENT_METHOD' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (numericAmount < 100) {
      return NextResponse.json(
        { error: 'Minimum amount is 100', code: 'AMOUNT_TOO_LOW' },
        { status: 400 }
      );
    }

    if (numericAmount > 50000) {
      return NextResponse.json(
        { error: 'Maximum amount is 50000', code: 'AMOUNT_TOO_HIGH' },
        { status: 400 }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['upi', 'card', 'netbanking', 'wallet'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { 
          error: `Payment method must be one of: ${validPaymentMethods.join(', ')}`, 
          code: 'INVALID_PAYMENT_METHOD' 
        },
        { status: 400 }
      );
    }

    // Fetch customer wallet
    const walletResult = await db
      .select()
      .from(customerWallets)
      .where(eq(customerWallets.userId, userId))
      .limit(1);

    if (walletResult.length === 0) {
      return NextResponse.json(
        { error: 'Wallet not found', code: 'WALLET_NOT_FOUND' },
        { status: 404 }
      );
    }

    const wallet = walletResult[0];

    // Calculate new balances
    const balanceBefore = wallet.balance;
    const newBalance = balanceBefore + numericAmount;
    const newTotalAdded = wallet.totalAdded + numericAmount;

    // Generate unique reference number
    const referenceNumber = `CWTXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const now = new Date().toISOString();

    // Create transaction record
    const newTransaction = await db
      .insert(customerWalletTransactions)
      .values({
        userId: userId,
        walletId: wallet.id,
        type: 'add_money',
        amount: numericAmount,
        balanceBefore: balanceBefore,
        balanceAfter: newBalance,
        description: description.trim(),
        referenceNumber: referenceNumber,
        paymentMethod: paymentMethod,
        status: 'completed',
        createdAt: now,
      })
      .returning();

    // Update wallet
    await db
      .update(customerWallets)
      .set({
        balance: newBalance,
        totalAdded: newTotalAdded,
        updatedAt: now,
      })
      .where(eq(customerWallets.id, wallet.id));

    return NextResponse.json(newTransaction[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}