import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs"; // Razorpay does NOT work on Edge runtime

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receiptId?: string;
  notes?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate and sanitize amount
    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Check credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys missing in environment variables.");
      return NextResponse.json(
        { success: false, error: "Server payment configuration error" },
        { status: 500 }
      );
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Prepare options for order creation
    const options = {
      amount: Math.round(amount * 100), // Convert Rupees to Paise
      currency: body.currency || "INR",
      receipt: body.receiptId || `receipt_${Date.now()}`,
      notes: body.notes || {},
    };

    // Create order
    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public key for frontend
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);

    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
