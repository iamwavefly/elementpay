"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { PaymentReceipt } from "../receipt/PaymentReceipt";
import { Button } from "@/components/ui";
import { OrderStatus } from "@/types";

interface CompletedStateProps {
  orderId: string;
  status: OrderStatus;
  onRetry: () => void;
}

export function CompletedState({
  orderId,
  status,
  onRetry,
}: CompletedStateProps) {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <div
          className={`w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center ${
            status === "settled" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {status === "settled" ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>
        <h1 className="text-4xl font-light text-black mb-4 tracking-tight">
          {status === "settled" ? "Payment Successful" : "Payment Failed"}
        </h1>
        <p className="text-lg text-gray-500 font-light">
          {status === "settled"
            ? "Your transaction has been completed successfully"
            : "Your transaction could not be processed"}
        </p>
      </div>

      <PaymentReceipt orderId={orderId} status={status} />

      <div className="text-center">
        <Button onClick={onRetry} size="lg">
          Create New Order
        </Button>
      </div>
    </div>
  );
}
