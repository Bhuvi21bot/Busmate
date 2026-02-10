import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driversNew, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { licenseNumber, phone, experienceYears } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        { 
          error: "User ID cannot be provided in request body",
          code: "USER_ID_NOT_ALLOWED" 
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!licenseNumber) {
      return NextResponse.json(
        { error: 'License number is required', code: 'MISSING_LICENSE_NUMBER' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required', code: 'MISSING_PHONE' },
        { status: 400 }
      );
    }

    if (experienceYears === undefined || experienceYears === null) {
      return NextResponse.json(
        { error: 'Experience years is required', code: 'MISSING_EXPERIENCE_YEARS' },
        { status: 400 }
      );
    }

    // Validate experienceYears is a positive integer within range
    const expYears = parseInt(experienceYears);
    if (isNaN(expYears) || expYears < 0 || expYears > 50) {
      return NextResponse.json(
        { 
          error: 'Experience years must be a positive integer between 0 and 50',
          code: 'INVALID_EXPERIENCE_YEARS' 
        },
        { status: 400 }
      );
    }

    // Validate phone number format (10 digits)
    const phonePattern = /^\d{10}$/;
    const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (!phonePattern.test(cleanPhone)) {
      return NextResponse.json(
        { 
          error: 'Phone number must be 10 digits',
          code: 'INVALID_PHONE_FORMAT' 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedLicenseNumber = licenseNumber.trim();
    const sanitizedPhone = cleanPhone;

    // Check if user already has a driver profile
    const existingUserDriver = await db
      .select()
      .from(driversNew)
      .where(eq(driversNew.userId, userId))
      .limit(1);

    if (existingUserDriver.length > 0) {
      return NextResponse.json(
        { 
          error: 'User already has a driver profile',
          code: 'DUPLICATE_USER_DRIVER' 
        },
        { status: 400 }
      );
    }

    // Check if license number is unique
    const existingLicense = await db
      .select()
      .from(driversNew)
      .where(eq(driversNew.licenseNumber, sanitizedLicenseNumber))
      .limit(1);

    if (existingLicense.length > 0) {
      return NextResponse.json(
        { 
          error: 'License number already registered',
          code: 'DUPLICATE_LICENSE_NUMBER' 
        },
        { status: 400 }
      );
    }

    // Create new driver registration
    const now = new Date().toISOString();
    const newDriver = await db
      .insert(driversNew)
      .values({
        userId: userId,
        licenseNumber: sanitizedLicenseNumber,
        phone: sanitizedPhone,
        experienceYears: expYears,
        rating: 0.0,
        totalTrips: 0,
        status: 'available',
        verificationStatus: 'pending',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Driver registration successful. Pending verification.',
        driver: newDriver[0],
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}