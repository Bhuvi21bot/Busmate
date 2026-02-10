import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid booking ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const booking = await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.id, parseInt(id)), eq(bookings.userId, session.user.id))
      )
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        {
          error: 'Booking not found or you do not have permission to access it',
          code: 'BOOKING_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(booking[0], { status: 200 });
  } catch (error) {
    console.error('GET booking error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid booking ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Only allow updating status and paymentStatus
    const { status, paymentStatus, ...otherFields } = body;

    if (Object.keys(otherFields).length > 0) {
      return NextResponse.json(
        {
          error: 'Only status and paymentStatus fields can be updated',
          code: 'INVALID_FIELDS',
        },
        { status: 400 }
      );
    }

    if (!status && !paymentStatus) {
      return NextResponse.json(
        {
          error: 'At least one field (status or paymentStatus) must be provided',
          code: 'NO_FIELDS_TO_UPDATE',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['confirmed', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate paymentStatus if provided
    const validPaymentStatuses = ['paid', 'pending', 'refunded'];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        {
          error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
          code: 'INVALID_PAYMENT_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if booking exists and belongs to user
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.id, parseInt(id)), eq(bookings.userId, session.user.id))
      )
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        {
          error: 'Booking not found or you do not have permission to update it',
          code: 'BOOKING_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: { status?: string; paymentStatus?: string; updatedAt: string } = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    // Update booking
    const updated = await db
      .update(bookings)
      .set(updateData)
      .where(
        and(eq(bookings.id, parseInt(id)), eq(bookings.userId, session.user.id))
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to update booking',
          code: 'UPDATE_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PATCH booking error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid booking ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if booking exists and belongs to user
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.id, parseInt(id)), eq(bookings.userId, session.user.id))
      )
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        {
          error: 'Booking not found or you do not have permission to cancel it',
          code: 'BOOKING_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Soft delete by setting status to 'cancelled'
    const cancelled = await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(eq(bookings.id, parseInt(id)), eq(bookings.userId, session.user.id))
      )
      .returning();

    if (cancelled.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to cancel booking',
          code: 'CANCEL_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Booking cancelled successfully',
        booking: cancelled[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE booking error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}