import { useState } from "react";
import { CreateOrderRequest } from "@/types";

export function useOrderApi() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrder = async (orderData: CreateOrderRequest) => {
    setIsSubmitting(true);

    try {
      console.log("Creating order with data:", orderData);

      const response = await fetch("/api/mock/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to create order`
        );
      }

      const order = await response.json();
      console.log("Order created successfully:", order);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createOrder,
    isSubmitting,
  };
}
