import { NextRequest, NextResponse } from "next/server"
import { db } from '@/db';
import { drivers } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const name = formData.get("name") as string
    const contact = formData.get("contact") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const district = formData.get("district") as string
    const license = formData.get("license") as string
    const vehicle = formData.get("vehicle") as string
    const bloodGroup = formData.get("bloodGroup") as string
    const email = formData.get("email") as string
    const idUpload = formData.get("idUpload") as File

    // Validate required fields
    if (!name || !contact || !address || !city || !district || !license || !vehicle || !bloodGroup) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate file upload
    if (!idUpload || idUpload.size === 0) {
      return NextResponse.json(
        { error: "Vehicle ID/License document is required" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(idUpload.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and PDF are allowed" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (idUpload.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      )
    }

    // Create application number
    const applicationNumber = Math.random().toString(36).substring(2, 12).toUpperCase()
    const now = new Date().toISOString()

    // Insert into database
    const newDriver = await db.insert(drivers).values({
      name,
      contact,
      address,
      city,
      district,
      license,
      vehicle,
      bloodGroup,
      email: email || null,
      fileName: idUpload.name,
      fileType: idUpload.type,
      status: "pending",
      applicationNumber,
      appliedDate: now,
      approvedDate: null,
      createdAt: now,
      updatedAt: now,
    }).returning()

    return NextResponse.json({
      success: true,
      application: newDriver[0],
      message: "Application submitted successfully! You'll receive a confirmation within 24-48 hours.",
    })
  } catch (error) {
    console.error("Driver registration error:", error)
    return NextResponse.json(
      { error: "Failed to submit application: " + error },
      { status: 500 }
    )
  }
}