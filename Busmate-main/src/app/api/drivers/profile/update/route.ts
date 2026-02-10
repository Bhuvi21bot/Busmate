import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { drivers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, name, contact, email, address, city, district, bloodGroup } = body;

    // Validate driverId
    if (!driverId || isNaN(parseInt(String(driverId)))) {
      return NextResponse.json(
        { 
          error: 'Valid driver ID is required',
          code: 'INVALID_DRIVER_ID'
        },
        { status: 400 }
      );
    }

    const id = parseInt(String(driverId));

    // Build update object with only provided fields
    const updates: Record<string, string> = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return NextResponse.json(
          { 
            error: 'Name cannot be empty',
            code: 'INVALID_NAME'
          },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    if (contact !== undefined) {
      const trimmedContact = String(contact).trim();
      if (!trimmedContact) {
        return NextResponse.json(
          { 
            error: 'Contact cannot be empty',
            code: 'INVALID_CONTACT'
          },
          { status: 400 }
        );
      }
      updates.contact = trimmedContact;
    }

    if (email !== undefined) {
      const trimmedEmail = String(email).trim().toLowerCase();
      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return NextResponse.json(
          { 
            error: 'Invalid email format',
            code: 'INVALID_EMAIL'
          },
          { status: 400 }
        );
      }
      updates.email = trimmedEmail || null;
    }

    if (address !== undefined) {
      const trimmedAddress = String(address).trim();
      if (!trimmedAddress) {
        return NextResponse.json(
          { 
            error: 'Address cannot be empty',
            code: 'INVALID_ADDRESS'
          },
          { status: 400 }
        );
      }
      updates.address = trimmedAddress;
    }

    if (city !== undefined) {
      const trimmedCity = String(city).trim();
      if (!trimmedCity) {
        return NextResponse.json(
          { 
            error: 'City cannot be empty',
            code: 'INVALID_CITY'
          },
          { status: 400 }
        );
      }
      updates.city = trimmedCity;
    }

    if (district !== undefined) {
      const trimmedDistrict = String(district).trim();
      if (!trimmedDistrict) {
        return NextResponse.json(
          { 
            error: 'District cannot be empty',
            code: 'INVALID_DISTRICT'
          },
          { status: 400 }
        );
      }
      updates.district = trimmedDistrict;
    }

    if (bloodGroup !== undefined) {
      const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const trimmedBloodGroup = String(bloodGroup).trim();
      if (!validBloodGroups.includes(trimmedBloodGroup)) {
        return NextResponse.json(
          { 
            error: `Blood group must be one of: ${validBloodGroups.join(', ')}`,
            code: 'INVALID_BLOOD_GROUP'
          },
          { status: 400 }
        );
      }
      updates.bloodGroup = trimmedBloodGroup;
    }

    // Check if at least one field to update is provided
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { 
          error: 'At least one field to update must be provided',
          code: 'NO_FIELDS_TO_UPDATE'
        },
        { status: 400 }
      );
    }

    // Always update the updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    // Update the driver record
    const updated = await db.update(drivers)
      .set(updates)
      .where(eq(drivers.id, id))
      .returning();

    // Check if driver was found and updated
    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { 
          error: 'Driver not found',
          code: 'DRIVER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}