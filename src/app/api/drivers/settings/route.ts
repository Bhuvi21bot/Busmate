import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driverSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const driverId = searchParams.get('driverId');

    // Validate driverId is provided
    if (!driverId) {
      return NextResponse.json({ 
        error: 'Driver ID is required',
        code: 'MISSING_DRIVER_ID' 
      }, { status: 400 });
    }

    // Validate driverId is a valid integer
    const driverIdInt = parseInt(driverId);
    if (isNaN(driverIdInt)) {
      return NextResponse.json({ 
        error: 'Driver ID must be a valid integer',
        code: 'INVALID_DRIVER_ID' 
      }, { status: 400 });
    }

    // Query driver_settings by driverId
    const settings = await db.select()
      .from(driverSettings)
      .where(eq(driverSettings.driverId, driverIdInt))
      .limit(1);

    // If settings not found, create default settings
    if (settings.length === 0) {
      const now = new Date().toISOString();
      const defaultSettings = await db.insert(driverSettings)
        .values({
          driverId: driverIdInt,
          notificationsEnabled: true,
          emailNotifications: true,
          smsNotifications: true,
          autoAcceptRides: false,
          availabilityStatus: 'available',
          preferredRoutes: null,
          language: 'en',
          theme: 'light',
          createdAt: now,
          updatedAt: now
        })
        .returning();

      return NextResponse.json(defaultSettings[0], { status: 200 });
    }

    return NextResponse.json(settings[0], { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, settings } = body;

    // Validate driverId is provided
    if (!driverId) {
      return NextResponse.json({ 
        error: 'Driver ID is required',
        code: 'MISSING_DRIVER_ID' 
      }, { status: 400 });
    }

    // Validate driverId is a valid integer
    const driverIdInt = parseInt(driverId);
    if (isNaN(driverIdInt)) {
      return NextResponse.json({ 
        error: 'Driver ID must be a valid integer',
        code: 'INVALID_DRIVER_ID' 
      }, { status: 400 });
    }

    // Validate settings object is provided
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      return NextResponse.json({ 
        error: 'Settings must be a valid object',
        code: 'INVALID_SETTINGS' 
      }, { status: 400 });
    }

    // Validate availabilityStatus if provided
    if (settings.availabilityStatus !== undefined) {
      const validStatuses = ['available', 'busy', 'offline'];
      if (!validStatuses.includes(settings.availabilityStatus)) {
        return NextResponse.json({ 
          error: 'Availability status must be one of: available, busy, offline',
          code: 'INVALID_AVAILABILITY_STATUS' 
        }, { status: 400 });
      }
    }

    // Validate theme if provided
    if (settings.theme !== undefined) {
      const validThemes = ['light', 'dark'];
      if (!validThemes.includes(settings.theme)) {
        return NextResponse.json({ 
          error: 'Theme must be one of: light, dark',
          code: 'INVALID_THEME' 
        }, { status: 400 });
      }
    }

    // Validate boolean fields
    const booleanFields = ['notificationsEnabled', 'emailNotifications', 'smsNotifications', 'autoAcceptRides'];
    for (const field of booleanFields) {
      if (settings[field] !== undefined && typeof settings[field] !== 'boolean') {
        return NextResponse.json({ 
          error: `${field} must be a boolean value`,
          code: 'INVALID_BOOLEAN_FIELD' 
        }, { status: 400 });
      }
    }

    // Validate preferredRoutes if provided
    if (settings.preferredRoutes !== undefined && settings.preferredRoutes !== null) {
      if (!Array.isArray(settings.preferredRoutes)) {
        return NextResponse.json({ 
          error: 'Preferred routes must be an array or null',
          code: 'INVALID_PREFERRED_ROUTES' 
        }, { status: 400 });
      }
    }

    // Fetch existing settings
    const existingSettings = await db.select()
      .from(driverSettings)
      .where(eq(driverSettings.driverId, driverIdInt))
      .limit(1);

    if (existingSettings.length === 0) {
      return NextResponse.json({ 
        error: 'Driver settings not found',
        code: 'SETTINGS_NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare update object with only provided fields
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    // Add only the fields that were provided in the settings object
    if (settings.notificationsEnabled !== undefined) {
      updateData.notificationsEnabled = settings.notificationsEnabled;
    }
    if (settings.emailNotifications !== undefined) {
      updateData.emailNotifications = settings.emailNotifications;
    }
    if (settings.smsNotifications !== undefined) {
      updateData.smsNotifications = settings.smsNotifications;
    }
    if (settings.autoAcceptRides !== undefined) {
      updateData.autoAcceptRides = settings.autoAcceptRides;
    }
    if (settings.availabilityStatus !== undefined) {
      updateData.availabilityStatus = settings.availabilityStatus;
    }
    if (settings.preferredRoutes !== undefined) {
      updateData.preferredRoutes = settings.preferredRoutes;
    }
    if (settings.language !== undefined) {
      updateData.language = settings.language;
    }
    if (settings.theme !== undefined) {
      updateData.theme = settings.theme;
    }

    // Update settings
    const updated = await db.update(driverSettings)
      .set(updateData)
      .where(eq(driverSettings.driverId, driverIdInt))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}