"use client";

import {
  WalletState,
  ProcessingState,
  CompletedState,
  TimeoutState,
} from "./state";
import { CreateOrderRequest, OrderStatus } from "@/types";

type AppState = "wallet" | "form" | "processing" | "completed" | "timeout";

interface AppRendererProps {
  currentState: AppState;
  currentOrderId: string | null;
  finalStatus: OrderStatus | null;
  isSubmitting: boolean;
  onOrderSubmit: (orderData: CreateOrderRequest) => void;
  onStatusChange: (status: OrderStatus) => void;
  onTimeout: () => void;
  onRetry: () => void;
}

export function AppRenderer({
  currentState,
  currentOrderId,
  finalStatus,
  isSubmitting,
  onOrderSubmit,
  onStatusChange,
  onTimeout,
  onRetry,
}: AppRendererProps) {
  switch (currentState) {
    case "wallet":
      return (
        <WalletState onSubmit={onOrderSubmit} isSubmitting={isSubmitting} />
      );

    case "processing":
      return currentOrderId ? (
        <ProcessingState
          orderId={currentOrderId}
          onStatusChange={onStatusChange}
          onTimeout={onTimeout}
        />
      ) : null;

    case "completed":
      return currentOrderId && finalStatus ? (
        <CompletedState
          orderId={currentOrderId}
          status={finalStatus}
          onRetry={onRetry}
        />
      ) : null;

    case "timeout":
      return <TimeoutState onRetry={onRetry} />;

    default:
      return null;
  }
}
