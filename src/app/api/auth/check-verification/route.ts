import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { otpVerification } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Check if there's a verified OTP for this email
    const verifiedRecords = await db.select()
      .from(otpVerification)
      .where(
        and(
          eq(otpVerification.email, email.toLowerCase()),
          eq(otpVerification.verified, true)
        )
      )
      .limit(1);

    const verified = verifiedRecords.length > 0;

    return NextResponse.json(
      {
        success: true,
        verified,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}