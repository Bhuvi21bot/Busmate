import { db } from "@/db"
import { verification, user } from "@/db/schema"
import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import { OTPTemplate } from "@/lib/emails/OTPTemplate"
import crypto from "crypto"
import { eq, and } from "drizzle-orm"

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

/**
 * Generate 6-digit cryptographically secure OTP
 */
function generateOTP(): string {
  const otp = crypto.randomInt(0, 1000000)
  return otp.toString().padStart(6, "0")
}

/**
 * Send OTP via email
 */
export async function sendOTP(email: string) {
  try {
    // Generate OTP
    const otp = generateOTP()
    
    // Calculate expiry (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    // Delete any existing OTPs for this email
    await db.delete(verification).where(
      and(
        eq(verification.identifier, email),
        eq(verification.value, "email-verification")
      )
    )

    // Store OTP in database
    await db.insert(verification).values({
      id: crypto.randomUUID(),
      identifier: email,
      value: otp,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Render email template
    const emailHtml = await render(OTPTemplate({ email, otp }))

    // Send via Gmail SMTP
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Bus Mate <bhuvaneshpaaraashar@gmail.com>",
      to: email,
      subject: "Verify your email - Bus Mate",
      html: emailHtml,
    })

    console.log("OTP email sent successfully:", result.messageId)

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("OTP send error:", error)
    throw error
  }
}

/**
 * Verify OTP and mark email as verified
 */
export async function verifyOTP(email: string, otp: string) {
  try {
    // Find OTP record
    const otpRecords = await db.select().from(verification).where(
      eq(verification.identifier, email)
    )

    const otpRecord = otpRecords.find(
      (record) => record.value === otp && new Date() < record.expiresAt
    )

    // Validate OTP exists and not expired
    if (!otpRecord) {
      return { success: false, error: "Invalid or expired OTP" }
    }

    // Mark user email as verified
    await db.update(user)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(user.email, email))

    // Delete used OTP
    await db.delete(verification).where(eq(verification.id, otpRecord.id))

    return { success: true }
  } catch (error) {
    console.error("OTP verify error:", error)
    throw error
  }
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const users = await db.select().from(user).where(eq(user.email, email))
    return users[0]?.emailVerified || false
  } catch (error) {
    console.error("Email verification check error:", error)
    return false
  }
}