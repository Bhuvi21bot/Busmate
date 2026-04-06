import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vehicles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid vehicle ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const vehicle = await db.select()
      .from(vehicles)
      .where(eq(vehicles.id, parseInt(id)))
      .limit(1);

    if (vehicle.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid vehicle ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, currentRoute, locationLat, locationLng, driverId } = body;

    // Check if vehicle exists
    const existingVehicle = await db.select()
      .from(vehicles)
      .where(eq(vehicles.id, parseInt(id)))
      .limit(1);

    if (existingVehicle.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'maintenance'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            error: 'Status must be one of: active, inactive, maintenance',
            code: 'INVALID_STATUS'
          },
          { status: 400 }
        );
      }
    }

    // Validate locationLat if provided
    if (locationLat !== undefined && locationLat !== null) {
      const lat = parseFloat(locationLat);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return NextResponse.json(
          { 
            error: 'Location latitude must be between -90 and 90',
            code: 'INVALID_LATITUDE'
          },
          { status: 400 }
        );
      }
    }

    // Validate locationLng if provided
    if (locationLng !== undefined && locationLng !== null) {
      const lng = parseFloat(locationLng);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return NextResponse.json(
          { 
            error: 'Location longitude must be between -180 and 180',
            code: 'INVALID_LONGITUDE'
          },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: {
      status?: string;
      currentRoute?: string | null;
      locationLat?: number | null;
      locationLng?: number | null;
      driverId?: string | null;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString()
    };

    if (status !== undefined) {
      updates.status = status;
    }

    if (currentRoute !== undefined) {
      updates.currentRoute = currentRoute;
    }

    if (locationLat !== undefined) {
      updates.locationLat = locationLat !== null ? parseFloat(locationLat) : null;
    }

    if (locationLng !== undefined) {
      updates.locationLng = locationLng !== null ? parseFloat(locationLng) : null;
    }

    if (driverId !== undefined) {
      updates.driverId = driverId;
    }

    const updatedVehicle = await db.update(vehicles)
      .set(updates)
      .where(eq(vehicles.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedVehicle[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}