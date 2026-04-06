import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { drivers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const license = searchParams.get('license');

    // Validate license parameter
    if (!license) {
      return NextResponse.json(
        { 
          error: 'License number is required',
          code: 'MISSING_LICENSE' 
        },
        { status: 400 }
      );
    }

    // Query database for driver by license number
    const driver = await db
      .select()
      .from(drivers)
      .where(eq(drivers.license, license))
      .limit(1);

    // Return 404 if driver not found
    if (driver.length === 0) {
      return NextResponse.json(
        { 
          error: 'Driver not found with provided license number',
          code: 'DRIVER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return driver profile
    return NextResponse.json(driver[0], { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}