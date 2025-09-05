import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@/types";
import { orders } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id: orderId } = await params;

    // Validate order ID format
    if (
      !orderId ||
      typeof orderId !== "string" ||
      !orderId.startsWith("ord_")
    ) {
      return NextResponse.json(
        { error: "invalid_order_id", message: "Invalid order ID format" },
        { status: 400 }
      );
    }

    console.log(`Looking for order: ${orderId}`);
    console.log(`Available orders:`, Array.from(orders.keys()));

    const order = orders.get(orderId);

    if (!order) {
      console.log(`Order not found: ${orderId}`);
      return NextResponse.json(
        { error: "order_not_found", message: `No order with id ${orderId}` },
        { status: 404 }
      );
    }

    console.log(`Order found: ${orderId}`, order);

    // Calculate time-based status only if not already finalized
    if (order.status === "created" || order.status === "processing") {
      const createdAt = new Date(order.created_at);
      const now = new Date();
      const secondsElapsed = Math.floor(
        (now.getTime() - createdAt.getTime()) / 1000
      );

      let newStatus: OrderStatus;
      if (secondsElapsed < 8) {
        newStatus = "created";
      } else if (secondsElapsed < 18) {
        newStatus = "processing";
      } else {
        // Transition to final status (we know order.status is "created" or "processing" here)
        // Use order ID to create a deterministic "random" result
        const hash = orderId.split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0);
        newStatus = Math.abs(hash) % 10 < 8 ? "settled" : "failed";
        console.log(
          `Order ${orderId} transitioning to final status: ${newStatus} (seconds elapsed: ${secondsElapsed})`
        );
      }

      // Update order status if it has changed and not already finalized
      if (order.status !== newStatus && newStatus !== order.status) {
        console.log(
          `Order ${orderId} status changing from ${order.status} to ${newStatus}`
        );
        order.status = newStatus;
        orders.set(orderId, order);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "server_error", message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
