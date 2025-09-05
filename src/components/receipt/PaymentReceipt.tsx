"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { OrderStatus } from "@/types";

interface PaymentReceiptProps {
  orderId: string;
  status: OrderStatus;
}

export function PaymentReceipt({ orderId, status }: PaymentReceiptProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto font-mono">
      {/* Receipt Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-light text-black mb-1">ElementPay</h2>
        <p className="text-gray-500 font-light">Payment Receipt</p>
      </div>

      {/* Receipt Content */}
      <div className="space-y-6">
        {/* Transaction ID */}
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">
            Transaction ID
          </p>
          <p className="text-base font-medium text-black break-all leading-relaxed">
            {orderId}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">Status</p>
          <div className="flex items-center space-x-3">
            {status === "settled" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span
              className={`text-base font-medium ${
                status === "settled" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status === "settled" ? "Settled" : "Failed"}
            </span>
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">Date & Time</p>
          <p className="text-base text-black font-light">
            {new Date().toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
      </div>

      {/* Receipt Footer */}
      <div className="mt-8 pt-6 text-center">
        <p className="text-gray-400 font-light">
          Thank you for using ElementPay
        </p>
      </div>
    </div>
  );
}
