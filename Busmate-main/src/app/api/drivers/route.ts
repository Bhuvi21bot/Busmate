import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { drivers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Query database for drivers with specified status
    const availableDrivers = await db
      .select({
        id: drivers.id,
        name: drivers.name,
        vehicle: drivers.vehicle,
        license: drivers.license,
        contact: drivers.contact,
        city: drivers.city,
        district: drivers.district,
        status: drivers.status,
        appliedDate: drivers.appliedDate,
        approvedDate: drivers.approvedDate,
      })
      .from(drivers)
      .where(eq(drivers.status, status))
      .orderBy(desc(drivers.approvedDate))
      .limit(limit);

    // Transform data to match frontend expectations
    const transformedDrivers = availableDrivers.map((driver, index) => ({
      id: driver.id,
      name: driver.name,
      vehicle: driver.vehicle,
      // Generate placeholder images based on driver id for consistency
      image: `https://images.unsplash.com/photo-${['1506794778202-cad84cf45f1d', '1547425260-76bcadfb4f2c', '1566492031773-4f4e44671857', '1519085360753-af0119f7cbe7'][index % 4]}?w=200`,
      rating: (4.7 + Math.random() * 0.3).toFixed(1), // Random rating between 4.7-5.0
      trips: Math.floor(500 + Math.random() * 2000), // Random trips between 500-2500
      distance: `${(0.5 + Math.random() * 2).toFixed(1)} km away`, // Random distance 0.5-2.5 km
      verified: driver.status === 'approved',
      available: driver.status === 'approved',
      city: driver.city,
      district: driver.district,
    }));

    return NextResponse.json({
      success: true,
      drivers: transformedDrivers,
      count: transformedDrivers.length
    }, { status: 200 });

  } catch (error) {
    console.error('GET drivers error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch drivers: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    );
  }
}
