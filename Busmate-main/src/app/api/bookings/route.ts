import { NextRequest, NextResponse } from "next/server"
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const VALID_VEHICLE_TYPES = ['government-bus', 'private-bus', 'chartered-bus', 'e-rickshaw'];
const VALID_STATUSES = ['confirmed', 'cancelled', 'completed'];
const VALID_PAYMENT_STATUSES = ['paid', 'pending', 'refunded'];

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json()
    
    // Extract and validate required fields
    const { pickup, dropoff, vehicleType, datetime, seats, fare, paymentId, orderId } = body
    
    if (!pickup || !dropoff || !vehicleType || !datetime || !seats || !fare) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate vehicleType
    if (!VALID_VEHICLE_TYPES.includes(vehicleType)) {
      return NextResponse.json(
        { error: `Invalid vehicle type. Must be one of: ${VALID_VEHICLE_TYPES.join(', ')}`, code: 'INVALID_VEHICLE_TYPE' },
        { status: 400 }
      );
    }

    // Validate seats is array
    if (!Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { error: 'Seats must be a non-empty array', code: 'INVALID_SEATS' },
        { status: 400 }
      );
    }

    // Validate fare is positive number
    const fareNum = parseFloat(fare);
    if (isNaN(fareNum) || fareNum <= 0) {
      return NextResponse.json(
        { error: 'Fare must be a positive number', code: 'INVALID_FARE' },
        { status: 400 }
      );
    }

    // Validate passengers
    const passengers = body.passengers || seats.length;
    if (isNaN(parseInt(passengers)) || parseInt(passengers) <= 0) {
      return NextResponse.json(
        { error: 'Passengers must be a positive integer', code: 'INVALID_PASSENGERS' },
        { status: 400 }
      );
    }

    // Validate payment information
    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: "Payment information is required. Please complete payment first." },
        { status: 400 }
      )
    }

    // Generate confirmation code (8 character random uppercase alphanumeric)
    const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date().toISOString();

    // Create booking with payment details
    const newBooking = await db.insert(bookings).values({
      userId: session.user.id,
      pickup: pickup.trim(),
      dropoff: dropoff.trim(),
      vehicleType,
      datetime,
      passengers: parseInt(passengers),
      seats: JSON.stringify(seats),
      fare: fareNum,
      paymentId,
      orderId,
      status: body.status || 'confirmed',
      paymentStatus: body.paymentStatus || 'paid',
      confirmationCode,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({
      success: true,
      booking: newBooking[0],
      message: "Booking confirmed successfully! Payment received.",
    }, { status: 201 })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      { error: "Failed to process booking: " + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const statusFilter = searchParams.get('status');

    let query = db.select().from(bookings).where(eq(bookings.userId, session.user.id));

    // Apply status filter if provided
    if (statusFilter) {
      if (!VALID_STATUSES.includes(statusFilter)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      query = query.where(and(eq(bookings.userId, session.user.id), eq(bookings.status, statusFilter)));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json({ bookings: results }, { status: 200 })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings: " + (error as Error).message },
      { status: 500 }
    )
  }
}