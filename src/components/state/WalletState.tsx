"use client";

import { WalletConnect } from "../WalletConnect";
import { OrderForm } from "../OrderForm";
import { CreateOrderRequest } from "@/types";

interface WalletStateProps {
  onSubmit: (orderData: CreateOrderRequest) => void;
  isSubmitting: boolean;
}

export function WalletState({ onSubmit, isSubmitting }: WalletStateProps) {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-black rounded-2xl flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h1 className="text-5xl font-light text-black mb-4 tracking-tight">
          ElementPay
        </h1>
        <p className="text-lg text-gray-500 font-light">
          Secure payment processing for the modern web
        </p>
      </div>

      <div className="space-y-8">
        <WalletConnect />
        <OrderForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
