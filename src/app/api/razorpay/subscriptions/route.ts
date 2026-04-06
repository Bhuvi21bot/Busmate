import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { bookings } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@/lib/auth"

interface SubscriptionRequest {
  productId: string
  productName: string
  amount: number
  paymentId: string
  orderId: string
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user using auth library
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please login to subscribe" },
        { status: 401 }
      )
    }

    const body: SubscriptionRequest = await request.json()
    const { productId, productName, amount, paymentId, orderId } = body

    // Validate required fields
    if (!productId || !productName || !amount || !paymentId || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Store subscription in database (using bookings table for now)
    const now = new Date().toISOString()
    const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase()

    const newSubscription = await db.insert(bookings).values({
      userId: session.user.id,
      pickup: "Subscription",
      dropoff: productName,
      vehicleType: productId,
      datetime: now,
      passengers: 1,
      fare: amount,
      seats: JSON.stringify([]),
      status: "confirmed",
      paymentStatus: "paid",
      paymentId,
      orderId,
      confirmationCode,
      createdAt: now,
      updatedAt: now,
    }).returning()

    return NextResponse.json(
      {
        success: true,
        message: "Subscription created successfully",
        subscription: {
          id: newSubscription[0].id,
          productId,
          productName,
          amount,
          status: "active",
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create subscription" },
      { status: 500 }
    )
  }
}

// Get user's active subscriptions
export async function GET(request: NextRequest) {
  try {
    // Authenticate user using auth library
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get active subscriptions (stored as bookings with pickup = "Subscription")
    const results = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, session.user.id),
          eq(bookings.pickup, "Subscription"),
          eq(bookings.status, "confirmed")
        )
      )
      .orderBy(bookings.createdAt)

    const subscriptions = results.map((row) => ({
      id: row.id,
      productId: row.vehicleType,
      productName: row.dropoff,
      amount: row.fare,
      status: "active",
      createdAt: row.createdAt,
    }))

    return NextResponse.json(
      {
        success: true,
        subscriptions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Fetch subscriptions error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 }
    )
  }
}