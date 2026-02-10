import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, bookings, drivers } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const driverId = searchParams.get('driverId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // If userId is requested, require authentication and ownership verification
    if (userId) {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'AUTH_REQUIRED' },
          { status: 401 }
        );
      }

      // Verify ownership - user can only get their own reviews
      if (session.user.id !== userId) {
        return NextResponse.json(
          { error: 'Access denied', code: 'ACCESS_DENIED' },
          { status: 403 }
        );
      }

      const userReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.userId, userId))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json(userReviews, { status: 200 });
    }

    // If driverId is requested, it's public (no auth required)
    if (driverId) {
      const driverIdNum = parseInt(driverId);
      if (isNaN(driverIdNum)) {
        return NextResponse.json(
          { error: 'Valid driver ID is required', code: 'INVALID_DRIVER_ID' },
          { status: 400 }
        );
      }

      const driverReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.driverId, driverIdNum))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json(driverReviews, { status: 200 });
    }

    // If no specific filter, return error
    return NextResponse.json(
      { error: 'Either userId or driverId parameter is required', code: 'MISSING_FILTER' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        { 
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED' 
        },
        { status: 400 }
      );
    }

    const { bookingId, rating, comment, driverId } = body;

    // Validate required fields
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required', code: 'MISSING_BOOKING_ID' },
        { status: 400 }
      );
    }

    if (!rating) {
      return NextResponse.json(
        { error: 'Rating is required', code: 'MISSING_RATING' },
        { status: 400 }
      );
    }

    // Validate rating is integer between 1 and 5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    // Validate bookingId is valid integer
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Valid booking ID is required', code: 'INVALID_BOOKING_ID' },
        { status: 400 }
      );
    }

    // Validate driverId if provided
    let driverIdNum = null;
    if (driverId) {
      driverIdNum = parseInt(driverId);
      if (isNaN(driverIdNum)) {
        return NextResponse.json(
          { error: 'Valid driver ID is required', code: 'INVALID_DRIVER_ID' },
          { status: 400 }
        );
      }

      // Verify driver exists
      const driver = await db
        .select()
        .from(drivers)
        .where(eq(drivers.id, driverIdNum))
        .limit(1);

      if (driver.length === 0) {
        return NextResponse.json(
          { error: 'Driver not found', code: 'DRIVER_NOT_FOUND' },
          { status: 400 }
        );
      }
    }

    // Verify booking exists and belongs to authenticated user
    const booking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, bookingIdNum),
          eq(bookings.userId, session.user.id)
        )
      )
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found or does not belong to user', code: 'BOOKING_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Create review with userId from session
    const newReview = await db
      .insert(reviews)
      .values({
        userId: session.user.id,
        bookingId: bookingIdNum,
        driverId: driverIdNum,
        rating: ratingNum,
        comment: comment?.trim() || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('POST reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
