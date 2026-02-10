import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface WebhookPayload {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        status: string;
        method: string;
        notes: Record<string, any>;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        status: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-razorpay-signature");
    
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 400 }
      );
    }

    const body = await request.text();

    // Verify webhook signature if secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      if (generatedSignature !== signature) {
        console.warn("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 }
        );
      }
    }

    const payload: WebhookPayload = JSON.parse(body);
    const { event, payload: data } = payload;

    // Handle different webhook events
    switch (event) {
      case "payment.authorized":
        console.log("Payment authorized:", data.payment?.entity.id);
        break;

      case "payment.captured":
        const paymentId = data.payment?.entity.id;
        const orderId = data.payment?.entity.order_id;
        const amount = data.payment?.entity.amount;

        console.log(`Payment captured: Order ${orderId}, Payment ${paymentId}, Amount: ${amount}`);
        
        // TODO: Update database if needed
        // The wallet should already be updated via the frontend verification flow
        break;

      case "payment.failed":
        console.log("Payment failed:", data.payment?.entity.id);
        break;

      case "order.paid":
        console.log("Order paid:", data.order?.entity.id);
        break;

      default:
        console.log("Unhandled webhook event:", event);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
