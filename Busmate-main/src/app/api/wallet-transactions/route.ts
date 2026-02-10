import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { walletTransactions } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const typeFilter = searchParams.get('type');

    let query = db.select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, session.user.id))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    if (typeFilter && (typeFilter === 'credit' || typeFilter === 'debit')) {
      query = db.select()
        .from(walletTransactions)
        .where(
          and(
            eq(walletTransactions.userId, session.user.id),
            eq(walletTransactions.type, typeFilter)
          )
        )
        .orderBy(desc(walletTransactions.createdAt))
        .limit(limit)
        .offset(offset);
    }

    const transactions = await query;

    return NextResponse.json(transactions, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { type, amount, balanceAfter, description, referenceId } = body;

    if (!type) {
      return NextResponse.json({ 
        error: "Transaction type is required",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    if (type !== 'credit' && type !== 'debit') {
      return NextResponse.json({ 
        error: "Transaction type must be 'credit' or 'debit'",
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ 
        error: "Amount is required",
        code: "MISSING_AMOUNT" 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (balanceAfter === undefined || balanceAfter === null) {
      return NextResponse.json({ 
        error: "Balance after transaction is required",
        code: "MISSING_BALANCE_AFTER" 
      }, { status: 400 });
    }

    if (typeof balanceAfter !== 'number' || balanceAfter < 0) {
      return NextResponse.json({ 
        error: "Balance after must be a non-negative number",
        code: "INVALID_BALANCE_AFTER" 
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ 
        error: "Description is required",
        code: "MISSING_DESCRIPTION" 
      }, { status: 400 });
    }

    const newTransaction = await db.insert(walletTransactions)
      .values({
        userId: session.user.id,
        type,
        amount,
        balanceAfter,
        description: description.trim(),
        referenceId: referenceId || null,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newTransaction[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}