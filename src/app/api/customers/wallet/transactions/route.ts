import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customerWalletTransactions } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const VALID_TRANSACTION_TYPES = ['add_money', 'ride_payment', 'refund', 'bonus'];
const VALID_STATUSES = ['pending', 'completed', 'failed'];

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse and validate limit
    const limitParam = searchParams.get('limit');
    let limit = 20;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          { error: 'Invalid limit parameter. Must be a positive integer.', code: 'INVALID_LIMIT' },
          { status: 400 }
        );
      }
      limit = Math.min(parsedLimit, 100);
    }

    // Parse and validate offset
    const offsetParam = searchParams.get('offset');
    let offset = 0;
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json(
          { error: 'Invalid offset parameter. Must be a non-negative integer.', code: 'INVALID_OFFSET' },
          { status: 400 }
        );
      }
      offset = parsedOffset;
    }

    // Parse and validate type filter
    const typeParam = searchParams.get('type');
    if (typeParam && !VALID_TRANSACTION_TYPES.includes(typeParam)) {
      return NextResponse.json(
        { 
          error: `Invalid transaction type. Must be one of: ${VALID_TRANSACTION_TYPES.join(', ')}`, 
          code: 'INVALID_TYPE' 
        },
        { status: 400 }
      );
    }

    // Parse and validate status filter
    const statusParam = searchParams.get('status');
    if (statusParam && !VALID_STATUSES.includes(statusParam)) {
      return NextResponse.json(
        { 
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 
          code: 'INVALID_STATUS' 
        },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions = [eq(customerWalletTransactions.userId, session.user.id)];

    if (typeParam) {
      conditions.push(eq(customerWalletTransactions.type, typeParam));
    }

    if (statusParam) {
      conditions.push(eq(customerWalletTransactions.status, statusParam));
    }

    // Execute query with filters
    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    const transactions = await db
      .select()
      .from(customerWalletTransactions)
      .where(whereCondition)
      .orderBy(desc(customerWalletTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(transactions, { status: 200 });

  } catch (error) {
    console.error('GET customer wallet transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}