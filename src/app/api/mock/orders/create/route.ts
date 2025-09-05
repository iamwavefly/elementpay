import { NextRequest, NextResponse } from "next/server";
import { CreateOrderRequest, Order } from "@/types";
import { orders } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        {
          error: "invalid_content_type",
          message: "Content-Type must be application/json",
        },
        { status: 400 }
      );
    }

    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json(
        {
          error: "invalid_amount",
          message: "Amount must be a positive number",
        },
        { status: 400 }
      );
    }

    if (
      !body.currency ||
      typeof body.currency !== "string" ||
      body.currency.trim() === ""
    ) {
      return NextResponse.json(
        {
          error: "invalid_currency",
          message: "Currency is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (
      !body.token ||
      typeof body.token !== "string" ||
      body.token.trim() === ""
    ) {
      return NextResponse.json(
        {
          error: "invalid_token",
          message: "Token is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    // Validate amount precision (max 2 decimal places)
    const amountStr = body.amount.toString();
    const decimalPlaces = amountStr.includes(".")
      ? amountStr.split(".")[1].length
      : 0;
    if (decimalPlaces > 2) {
      return NextResponse.json(
        {
          error: "invalid_amount_precision",
          message: "Amount can have at most 2 decimal places",
        },
        { status: 400 }
      );
    }

    // Validate currency format (3-letter code)
    if (!/^[A-Z]{3}$/.test(body.currency)) {
      return NextResponse.json(
        {
          error: "invalid_currency_format",
          message: "Currency must be a 3-letter uppercase code",
        },
        { status: 400 }
      );
    }

    // Generate secure order ID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 11);
    const orderId = `ord_${timestamp}_${randomPart}`;

    // Create order
    const order: Order = {
      order_id: orderId,
      status: "created",
      amount: body.amount,
      currency: body.currency,
      token: body.token,
      note: body.note,
      created_at: new Date().toISOString(),
    };

    // Store order
    orders.set(orderId, order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "server_error", message: "Failed to create order" },
      { status: 500 }
    );
  }
}
