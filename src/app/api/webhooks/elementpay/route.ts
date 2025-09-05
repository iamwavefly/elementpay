import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/webhook";
import { WebhookPayload } from "@/types";
import { orders } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("X-Webhook-Signature");
    if (!signature) {
      return NextResponse.json(
        {
          error: "missing_signature",
          message: "X-Webhook-Signature header required",
        },
        { status: 401 }
      );
    }

    const rawBody = await request.text();
    const secret = "shh_super_secret"; // Hardcoded for simplicity

    // Verify webhook signature
    if (!verifyWebhookSignature(signature, rawBody, secret)) {
      return NextResponse.json(
        { error: "invalid_signature", message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: WebhookPayload = JSON.parse(rawBody);
    const { order_id, status } = payload.data;

    // Validate payload structure
    if (!order_id || !status) {
      return NextResponse.json(
        {
          error: "invalid_payload",
          message: "Missing order_id or status in payload",
        },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ["settled", "failed", "processing"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "invalid_status", message: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    // Update order status
    const order = orders.get(order_id);
    if (order) {
      // Only update if the incoming status is a final state and the current state is not already final
      if (
        (status === "settled" || status === "failed") &&
        (order.status === "created" || order.status === "processing")
      ) {
        order.status = status;
        orders.set(order_id, order);
        console.log(`Webhook updated order ${order_id} to status: ${status}`);
      }
    } else {
      console.warn(`Webhook received for unknown order ID: ${order_id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "server_error", message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
