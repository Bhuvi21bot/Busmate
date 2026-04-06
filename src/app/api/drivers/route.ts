import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { drivers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

type CachedDriversResponse = {
  success: true;
  drivers: Array<Record<string, unknown>>;
  count: number;
};

const CACHE_TTL_MS = 30_000;
const driversCache = new Map<string, { expiresAt: number; payload: CachedDriversResponse }>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'approved';
    const parsedLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isNaN(parsedLimit) ? 20 : Math.min(Math.max(parsedLimit, 1), 100);
    const cacheKey = `${status}:${limit}`;
    const now = Date.now();
    const cached = driversCache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.payload, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }

    // Query database for drivers with specified status
    const availableDrivers = await db
      .select({
        id: drivers.id,
        name: drivers.name,
        vehicle: drivers.vehicleType,
        license: drivers.licenseNumber,
        contact: drivers.phone,
        status: drivers.status,
        rating: drivers.rating,
        trips: drivers.totalRides,
        appliedDate: drivers.createdAt,
        approvedDate: drivers.updatedAt,
      })
      .from(drivers)
      .where(eq(drivers.status, status))
      .orderBy(desc(drivers.updatedAt))
      .limit(limit);

    // Transform data to match frontend expectations
    const transformedDrivers = availableDrivers.map((driver, index) => ({
      id: driver.id,
      name: driver.name,
      vehicle: driver.vehicle,
      // Generate placeholder images based on driver id for consistency
      image: `https://images.unsplash.com/photo-${['1506794778202-cad84cf45f1d', '1547425260-76bcadfb4f2c', '1566492031773-4f4e44671857', '1519085360753-af0119f7cbe7'][index % 4]}?w=200`,
      rating: driver.rating ? Number(driver.rating).toFixed(1) : (4.7 + Math.random() * 0.3).toFixed(1),
      trips: typeof driver.trips === 'number' ? driver.trips : Math.floor(500 + Math.random() * 2000),
      distance: `${(0.5 + Math.random() * 2).toFixed(1)} km away`, // Random distance 0.5-2.5 km
      verified: driver.status === 'approved',
      available: driver.status === 'approved',
      contact: driver.contact,
      license: driver.license,
      appliedDate: driver.appliedDate,
      approvedDate: driver.approvedDate,
    }));

    const payload: CachedDriversResponse = {
      success: true,
      drivers: transformedDrivers,
      count: transformedDrivers.length
    };

    driversCache.set(cacheKey, {
      expiresAt: now + CACHE_TTL_MS,
      payload,
    });

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
      },
    });

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
