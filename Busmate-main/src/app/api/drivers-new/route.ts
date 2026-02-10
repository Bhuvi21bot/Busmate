import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { driversNew, user } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Parse filter parameters
    const statusFilter = searchParams.get('status');
    const verificationStatusFilter = searchParams.get('verificationStatus');
    
    // Validate status filter if provided
    if (statusFilter && !['available', 'on-trip', 'offline'].includes(statusFilter)) {
      return NextResponse.json({ 
        error: 'Invalid status value. Must be one of: available, on-trip, offline',
        code: 'INVALID_STATUS_FILTER'
      }, { status: 400 });
    }
    
    // Validate verificationStatus filter if provided
    if (verificationStatusFilter && !['pending', 'verified', 'rejected'].includes(verificationStatusFilter)) {
      return NextResponse.json({ 
        error: 'Invalid verificationStatus value. Must be one of: pending, verified, rejected',
        code: 'INVALID_VERIFICATION_STATUS_FILTER'
      }, { status: 400 });
    }
    
    // Build where conditions
    const conditions = [];
    
    if (statusFilter) {
      conditions.push(eq(driversNew.status, statusFilter));
    }
    
    if (verificationStatusFilter) {
      conditions.push(eq(driversNew.verificationStatus, verificationStatusFilter));
    }
    
    // Build query with joins to get user details
    let query = db
      .select({
        id: driversNew.id,
        userId: driversNew.userId,
        licenseNumber: driversNew.licenseNumber,
        phone: driversNew.phone,
        experienceYears: driversNew.experienceYears,
        rating: driversNew.rating,
        totalTrips: driversNew.totalTrips,
        status: driversNew.status,
        verificationStatus: driversNew.verificationStatus,
        createdAt: driversNew.createdAt,
        updatedAt: driversNew.updatedAt,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(driversNew)
      .leftJoin(user, eq(driversNew.userId, user.id))
      .orderBy(desc(driversNew.rating));
    
    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply pagination
    const results = await query.limit(limit).offset(offset);
    
    return NextResponse.json(results, { status: 200 });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}