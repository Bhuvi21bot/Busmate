import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { walletTransactions, driverRides } from '@/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const driverId = searchParams.get('driverId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate driverId is provided and is valid
    if (!driverId || isNaN(parseInt(driverId))) {
      return NextResponse.json(
        { 
          error: 'Valid driverId is required',
          code: 'INVALID_DRIVER_ID'
        },
        { status: 400 }
      );
    }

    // Validate limit is positive
    if (limit < 1) {
      return NextResponse.json(
        { 
          error: 'Limit must be at least 1',
          code: 'INVALID_LIMIT'
        },
        { status: 400 }
      );
    }

    // Validate offset is non-negative
    if (offset < 0) {
      return NextResponse.json(
        { 
          error: 'Offset must be non-negative',
          code: 'INVALID_OFFSET'
        },
        { status: 400 }
      );
    }

    // Validate type if provided
    const validTypes = ['credit', 'debit', 'withdrawal', 'refund', 'ride_earning'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { 
          error: 'Invalid transaction type. Must be one of: ' + validTypes.join(', '),
          code: 'INVALID_TYPE'
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['pending', 'completed', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
          code: 'INVALID_STATUS'
        },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions = [eq(walletTransactions.driverId, parseInt(driverId))];

    if (type) {
      conditions.push(eq(walletTransactions.type, type));
    }

    if (status) {
      conditions.push(eq(walletTransactions.status, status));
    }

    // Execute query with filters
    const transactions = await db
      .select({
        id: walletTransactions.id,
        driverId: walletTransactions.driverId,
        walletId: walletTransactions.walletId,
        type: walletTransactions.type,
        amount: walletTransactions.amount,
        balanceAfter: walletTransactions.balanceAfter,
        description: walletTransactions.description,
        referenceNumber: walletTransactions.referenceNumber,
        rideId: walletTransactions.rideId,
        status: walletTransactions.status,
        createdAt: walletTransactions.createdAt,
        rideNumber: driverRides.rideNumber,
        rideDate: driverRides.date,
        rideRoute: driverRides.route,
        rideFare: driverRides.fare,
        ridePassengerCount: driverRides.passengerCount,
        rideStatus: driverRides.status,
      })
      .from(walletTransactions)
      .leftJoin(
        driverRides,
        eq(walletTransactions.rideId, driverRides.id)
      )
      .where(and(...conditions))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    // Format response - build ride object only if ride data exists
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      driverId: transaction.driverId,
      walletId: transaction.walletId,
      type: transaction.type,
      amount: transaction.amount,
      balanceAfter: transaction.balanceAfter,
      description: transaction.description,
      referenceNumber: transaction.referenceNumber,
      rideId: transaction.rideId,
      status: transaction.status,
      createdAt: transaction.createdAt,
      ride: transaction.rideNumber ? {
        rideNumber: transaction.rideNumber,
        date: transaction.rideDate,
        route: transaction.rideRoute,
        fare: transaction.rideFare,
        passengerCount: transaction.ridePassengerCount,
        status: transaction.rideStatus,
      } : null,
    }));

    return NextResponse.json(formattedTransactions, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}