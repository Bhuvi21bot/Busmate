import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { drivers } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_STATUSES = ['pending', 'approved', 'rejected'] as const;
type DriverStatus = typeof VALID_STATUSES[number];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid driver ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const driverId = parseInt(id);

    // Parse and validate request body
    const body = await request.json();
    const { status } = body;

    // Validate status is provided
    if (!status) {
      return NextResponse.json(
        { 
          error: 'Status is required',
          code: 'MISSING_STATUS'
        },
        { status: 400 }
      );
    }

    // Validate status is one of the allowed values
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { 
          error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS'
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      status: DriverStatus;
      approvedDate: string | null;
      updatedAt: string;
    } = {
      status,
      approvedDate: status === 'approved' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    // Update driver status
    const updatedDriver = await db
      .update(drivers)
      .set(updateData)
      .where(eq(drivers.id, driverId))
      .returning();

    // Check if driver was found
    if (updatedDriver.length === 0) {
      return NextResponse.json(
        { 
          error: 'Driver not found',
          code: 'DRIVER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDriver[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}