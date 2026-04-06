import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driverReviews, drivers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - Fetch reviews submitted by the authenticated customer
export async function GET(request: NextRequest) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          error: 'Unauthorized - Please login',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    const customerId = session.user.id;

    // Fetch reviews submitted by this customer with driver details
    const reviews = await db
      .select({
        id: driverReviews.id,
        driverId: driverReviews.driverId,
        customerId: driverReviews.customerId,
        customerName: driverReviews.customerName,
        rating: driverReviews.rating,
        comment: driverReviews.comment,
        rideId: driverReviews.rideId,
        createdAt: driverReviews.createdAt,
        updatedAt: driverReviews.updatedAt,
        driverName: drivers.name,
        driverVehicle: drivers.vehicle,
        driverLicense: drivers.license,
      })
      .from(driverReviews)
      .leftJoin(drivers, eq(driverReviews.driverId, drivers.id))
      .where(eq(driverReviews.customerId, customerId))
      .orderBy(desc(driverReviews.createdAt));

    return NextResponse.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review.id,
        driverId: review.driverId,
        rating: review.rating,
        comment: review.comment,
        rideId: review.rideId,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        driver: {
          name: review.driverName,
          vehicle: review.driverVehicle,
          license: review.driverLicense,
        }
      }))
    });

  } catch (error) {
    console.error('GET customer reviews error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}
