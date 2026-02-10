import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { otpVerification } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendOTPEmail } from '@/lib/emails/send-email';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!type || !['register', 'login'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be either "register" or "login"' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing unverified OTPs for this email
    await db.delete(otpVerification)
      .where(
        and(
          eq(otpVerification.email, email.toLowerCase()),
          eq(otpVerification.verified, false)
        )
      );

    // Insert new OTP
    await db.insert(otpVerification).values({
      email: email.toLowerCase(),
      otpCode,
      expiresAt,
      verified: false,
    });

    // Send email with OTP
    try {
      await sendOTPEmail({
        to: email,
        otpCode,
        type,
      });

      return NextResponse.json(
        {
          success: true,
          message: `Verification code sent to ${email}. Please check your email.`,
          // Only show OTP in development mode
          devOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Still return success but with dev OTP for development
      return NextResponse.json(
        {
          success: true,
          message: 'Verification code generated. Check console in development.',
          devOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
          emailWarning: 'Email service unavailable. Using fallback method.',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}