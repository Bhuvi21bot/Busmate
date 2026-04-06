import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driverRides } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate driverId parameter
    if (!driverId) {
      return NextResponse.json(
        {
          error: 'driverId parameter is required',
          code: 'MISSING_DRIVER_ID',
        },
        { status: 400 }
      );
    }

    // Validate driverId is a valid integer
    const driverIdInt = parseInt(driverId);
    if (isNaN(driverIdInt)) {
      return NextResponse.json(
        {
          error: 'driverId must be a valid integer',
          code: 'INVALID_DRIVER_ID',
        },
        { status: 400 }
      );
    }

    // Query database for driver rides
    const rides = await db
      .select()
      .from(driverRides)
      .where(eq(driverRides.driverId, driverIdInt))
      .orderBy(desc(driverRides.date))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(rides, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}