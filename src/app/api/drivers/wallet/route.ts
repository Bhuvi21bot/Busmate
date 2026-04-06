import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driverWallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');

    // Validate driverId parameter
    if (!driverId) {
      return NextResponse.json(
        { 
          error: 'Driver ID is required',
          code: 'MISSING_DRIVER_ID'
        },
        { status: 400 }
      );
    }

    // Validate driverId is a valid integer
    const parsedDriverId = parseInt(driverId);
    if (isNaN(parsedDriverId)) {
      return NextResponse.json(
        { 
          error: 'Valid driver ID is required',
          code: 'INVALID_DRIVER_ID'
        },
        { status: 400 }
      );
    }

    // Query database for driver wallet
    const wallet = await db.select()
      .from(driverWallets)
      .where(eq(driverWallets.driverId, parsedDriverId))
      .limit(1);

    // Return 404 if wallet not found
    if (wallet.length === 0) {
      return NextResponse.json(
        { 
          error: 'Driver wallet not found',
          code: 'WALLET_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Return wallet object
    return NextResponse.json(wallet[0], { status: 200 });

  } catch (error) {
    console.error('GET driver wallet error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}