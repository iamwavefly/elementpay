export type OrderStatus = "created" | "processing" | "settled" | "failed";

export interface Order {
  order_id: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  token: string;
  note?: string;
  created_at: string;
}

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  token: string;
  note?: string;
}

export interface WebhookPayload {
  type: "order.settled" | "order.failed" | "order.processing";
  data: {
    order_id: string;
    status: OrderStatus;
  };
}

export interface ApiError {
  error: string;
  message: string;
}
