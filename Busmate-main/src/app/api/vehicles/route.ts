import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vehicles } from '@/db/schema';
import { eq, and, or, like } from 'drizzle-orm';

const VALID_VEHICLE_TYPES = ['government-bus', 'private-bus', 'chartered-bus', 'e-rickshaw'];
const VALID_STATUSES = ['active', 'inactive', 'maintenance'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const vehicleType = searchParams.get('vehicleType');
    const status = searchParams.get('status') ?? 'active';

    let query = db.select().from(vehicles);

    const conditions = [];

    if (status) {
      conditions.push(eq(vehicles.status, status));
    }

    if (vehicleType) {
      conditions.push(eq(vehicles.vehicleType, vehicleType));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, vehicleType, capacity, driverId, status, currentRoute, locationLat, locationLng } = body;

    // Validate required fields
    if (!vehicleNumber) {
      return NextResponse.json(
        { error: 'Vehicle number is required', code: 'MISSING_VEHICLE_NUMBER' },
        { status: 400 }
      );
    }

    if (!vehicleType) {
      return NextResponse.json(
        { error: 'Vehicle type is required', code: 'MISSING_VEHICLE_TYPE' },
        { status: 400 }
      );
    }

    if (!capacity) {
      return NextResponse.json(
        { error: 'Capacity is required', code: 'MISSING_CAPACITY' },
        { status: 400 }
      );
    }

    // Validate vehicleType
    if (!VALID_VEHICLE_TYPES.includes(vehicleType)) {
      return NextResponse.json(
        {
          error: `Invalid vehicle type. Must be one of: ${VALID_VEHICLE_TYPES.join(', ')}`,
          code: 'INVALID_VEHICLE_TYPE'
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS'
        },
        { status: 400 }
      );
    }

    // Validate capacity is positive integer
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return NextResponse.json(
        { error: 'Capacity must be a positive integer', code: 'INVALID_CAPACITY' },
        { status: 400 }
      );
    }

    // Check if vehicleNumber already exists
    const existingVehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.vehicleNumber, vehicleNumber.trim()))
      .limit(1);

    if (existingVehicle.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle number already exists', code: 'DUPLICATE_VEHICLE_NUMBER' },
        { status: 400 }
      );
    }

    // Prepare insert data with auto-generated fields
    const now = new Date().toISOString();
    const insertData: any = {
      vehicleNumber: vehicleNumber.trim(),
      vehicleType,
      capacity: capacityNum,
      status: status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };

    // Add optional fields if provided
    if (driverId !== undefined && driverId !== null) {
      insertData.driverId = driverId;
    }

    if (currentRoute !== undefined && currentRoute !== null) {
      insertData.currentRoute = currentRoute;
    }

    if (locationLat !== undefined && locationLat !== null) {
      insertData.locationLat = locationLat;
    }

    if (locationLng !== undefined && locationLng !== null) {
      insertData.locationLng = locationLng;
    }

    const newVehicle = await db.insert(vehicles).values(insertData).returning();

    return NextResponse.json(newVehicle[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}