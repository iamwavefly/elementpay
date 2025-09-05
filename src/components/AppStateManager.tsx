"use client";

import { useAppState } from "@/hooks/useAppState";
import { AppRenderer } from "./AppRenderer";

export function AppStateManager() {
  const {
    currentState,
    currentOrderId,
    finalStatus,
    isSubmitting,
    handleOrderSubmit,
    handleStatusChange,
    handleTimeout,
    handleRetry,
  } = useAppState();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <AppRenderer
            currentState={currentState}
            currentOrderId={currentOrderId}
            finalStatus={finalStatus}
            isSubmitting={isSubmitting}
            onOrderSubmit={handleOrderSubmit}
            onStatusChange={handleStatusChange}
            onTimeout={handleTimeout}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
}
