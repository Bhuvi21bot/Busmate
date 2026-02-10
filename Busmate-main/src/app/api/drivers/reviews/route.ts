import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driverReviews, driverRides } from '@/db/schema';
import { eq, desc, avg } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');

    // Validate driverId parameter
    if (!driverId) {
      return NextResponse.json(
        { 
          error: 'driverId parameter is required',
          code: 'MISSING_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    const driverIdInt = parseInt(driverId);
    if (isNaN(driverIdInt)) {
      return NextResponse.json(
        { 
          error: 'driverId must be a valid integer',
          code: 'INVALID_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    // Fetch reviews with LEFT JOIN to driver_rides
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
        rideNumber: driverRides.rideNumber,
        route: driverRides.route,
        rideDate: driverRides.date,
      })
      .from(driverReviews)
      .leftJoin(driverRides, eq(driverReviews.rideId, driverRides.id))
      .where(eq(driverReviews.driverId, driverIdInt))
      .orderBy(desc(driverReviews.createdAt));

    // Calculate average rating
    const avgRatingResult = await db
      .select({ avgRating: avg(driverReviews.rating) })
      .from(driverReviews)
      .where(eq(driverReviews.driverId, driverIdInt));

    const averageRating = avgRatingResult[0]?.avgRating 
      ? Math.round(parseFloat(avgRatingResult[0].avgRating) * 10) / 10
      : 0;

    // Format response with ride details
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      driverId: review.driverId,
      customerId: review.customerId,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      rideId: review.rideId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      ride: review.rideId && review.rideNumber
        ? {
            rideNumber: review.rideNumber,
            route: review.route,
            date: review.rideDate,
          }
        : null,
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      averageRating,
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, customerId, customerName, rating, comment, rideId } = body;

    // Validate driverId
    if (!driverId) {
      return NextResponse.json(
        { 
          error: 'driverId is required',
          code: 'MISSING_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(driverId))) {
      return NextResponse.json(
        { 
          error: 'driverId must be a valid integer',
          code: 'INVALID_DRIVER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate customerId
    if (!customerId || typeof customerId !== 'string' || customerId.trim() === '') {
      return NextResponse.json(
        { 
          error: 'customerId is required and must be a non-empty string',
          code: 'MISSING_CUSTOMER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate customerName
    if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'customerName is required and must be a non-empty string',
          code: 'MISSING_CUSTOMER_NAME' 
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { 
          error: 'rating is required',
          code: 'MISSING_RATING' 
        },
        { status: 400 }
      );
    }

    const ratingInt = parseInt(rating);
    if (isNaN(ratingInt)) {
      return NextResponse.json(
        { 
          error: 'rating must be a valid integer',
          code: 'INVALID_RATING' 
        },
        { status: 400 }
      );
    }

    if (ratingInt < 1 || ratingInt > 5) {
      return NextResponse.json(
        { 
          error: 'Rating must be between 1 and 5',
          code: 'RATING_OUT_OF_RANGE' 
        },
        { status: 400 }
      );
    }

    // Validate rideId if provided
    if (rideId !== undefined && rideId !== null) {
      const rideIdInt = parseInt(rideId);
      if (isNaN(rideIdInt)) {
        return NextResponse.json(
          { 
            error: 'rideId must be a valid integer if provided',
            code: 'INVALID_RIDE_ID' 
          },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData: any = {
      driverId: parseInt(driverId),
      customerId: customerId.trim(),
      customerName: customerName.trim(),
      rating: ratingInt,
      comment: comment || null,
      createdAt: now,
      updatedAt: now,
    };

    // Add rideId if provided
    if (rideId !== undefined && rideId !== null) {
      insertData.rideId = parseInt(rideId);
    }

    // Insert into database
    const newReview = await db
      .insert(driverReviews)
      .values(insertData)
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}