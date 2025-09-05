"use client";

import { OrderStatusComponent } from "../OrderStatus";
import { OrderStatus } from "@/types";

interface ProcessingStateProps {
  orderId: string;
  onStatusChange: (status: OrderStatus) => void;
  onTimeout: () => void;
}

export function ProcessingState({
  orderId,
  onStatusChange,
  onTimeout,
}: ProcessingStateProps) {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-8 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-4xl font-light text-black mb-4 tracking-tight">
          Processing Payment
        </h1>
        <p className="text-lg text-gray-500 font-light">
          Please wait while we process your transaction
        </p>
      </div>

      <OrderStatusComponent
        orderId={orderId}
        onStatusChange={onStatusChange}
        onTimeout={onTimeout}
      />
    </div>
  );
}
