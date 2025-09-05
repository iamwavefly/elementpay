import { useState } from "react";
import { CreateOrderRequest, OrderStatus } from "@/types";
import { useOrderApi } from "./useOrderApi";

type AppState = "wallet" | "form" | "processing" | "completed" | "timeout";

export function useAppState() {
  const [currentState, setCurrentState] = useState<AppState>("wallet");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [finalStatus, setFinalStatus] = useState<OrderStatus | null>(null);
  const { createOrder, isSubmitting } = useOrderApi();

  const handleOrderSubmit = async (orderData: CreateOrderRequest) => {
    try {
      const order = await createOrder(orderData);
      setCurrentOrderId(order.order_id);
      setCurrentState("processing");
    } catch (error) {
      console.error("Failed to create order:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again.";
      alert(errorMessage);
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    setFinalStatus(status);
    setCurrentState("completed");
  };

  const handleTimeout = () => {
    setCurrentState("timeout");
  };

  const handleRetry = () => {
    setCurrentState("wallet");
    setCurrentOrderId(null);
    setFinalStatus(null);
  };

  return {
    currentState,
    currentOrderId,
    finalStatus,
    isSubmitting,
    handleOrderSubmit,
    handleStatusChange,
    handleTimeout,
    handleRetry,
  };
}
