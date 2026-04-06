import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Note: customerSettings table doesn't exist in schema
// This is a stub endpoint to prevent errors in the frontend

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Return default settings
    return NextResponse.json({
      id: 1,
      userId: session.user.id,
      notificationsEnabled: true,
      emailNotifications: true,
      smsNotifications: true,
      rideReminders: true,
      promotionalEmails: false,
      language: 'en',
      theme: 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/customers/settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const body = await request.json();

    // Return updated settings (stubbed - no actual database update)
    return NextResponse.json({
      id: 1,
      userId: session.user.id,
      notificationsEnabled: body.notificationsEnabled ?? true,
      emailNotifications: body.emailNotifications ?? true,
      smsNotifications: body.smsNotifications ?? true,
      rideReminders: body.rideReminders ?? true,
      promotionalEmails: body.promotionalEmails ?? false,
      language: body.language ?? 'en',
      theme: body.theme ?? 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('PUT /api/customers/settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}
