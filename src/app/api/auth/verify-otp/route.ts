import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { otpVerification } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, otp_code } = await request.json();

    // Validate input
    if (!email || !otp_code) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    if (otp_code.length !== 6 || !/^\d+$/.test(otp_code)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format. Must be 6 digits.' },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecords = await db.select()
      .from(otpVerification)
      .where(
        and(
          eq(otpVerification.email, email.toLowerCase()),
          eq(otpVerification.otpCode, otp_code),
          eq(otpVerification.verified, false),
          gt(otpVerification.expiresAt, new Date())
        )
      )
      .limit(1);

    if (otpRecords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP code', verified: false },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await db.update(otpVerification)
      .set({ verified: true })
      .where(eq(otpVerification.id, otpRecords[0].id));

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP', verified: false },
      { status: 500 }
    );
  }
}