import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driversNew, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Fetch driver with user details
    const driverRecord = await db
      .select({
        id: driversNew.id,
        userId: driversNew.userId,
        licenseNumber: driversNew.licenseNumber,
        phone: driversNew.phone,
        experienceYears: driversNew.experienceYears,
        rating: driversNew.rating,
        totalTrips: driversNew.totalTrips,
        status: driversNew.status,
        verificationStatus: driversNew.verificationStatus,
        createdAt: driversNew.createdAt,
        updatedAt: driversNew.updatedAt,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(driversNew)
      .leftJoin(user, eq(driversNew.userId, user.id))
      .where(eq(driversNew.id, parseInt(id)))
      .limit(1);

    // Check if driver exists
    if (driverRecord.length === 0) {
      return NextResponse.json(
        { 
          error: 'Driver not found',
          code: 'DRIVER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(driverRecord[0], { status: 200 });

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