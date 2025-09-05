"use client";

import { useState, memo } from "react";
import { useAccount } from "wagmi";
import { CreateOrderRequest } from "@/types";
import { Button } from "./ui";

interface OrderFormProps {
  onSubmit: (order: CreateOrderRequest) => void;
  isSubmitting: boolean;
}

export const OrderForm = memo(function OrderForm({
  onSubmit,
  isSubmitting,
}: OrderFormProps) {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState<CreateOrderRequest>({
    amount: 0,
    currency: "KES",
    token: "USDC",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.token) {
      newErrors.token = "Token is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    if (validateForm()) {
      console.log("Form validation passed, submitting...");
      onSubmit(formData);
    } else {
      console.log("Form validation failed");
    }
  };

  const handleChange = (
    field: keyof CreateOrderRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-light text-black mb-2">Wallet Required</h3>
        <p className="text-gray-500 font-light">
          Please connect your wallet to create an order
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-4">
      <div className="text-center">
        <h2 className="text-2xl font-light text-black mb-2 tracking-tight">
          Create Order
        </h2>
        <p className="text-gray-500 font-light">
          Fill in the details below to process your payment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Amount *
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={formData.amount || ""}
                onChange={(e) =>
                  handleChange("amount", parseFloat(e.target.value) || 0)
                }
                className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-colors text-lg text-black ${
                  errors.amount
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-medium">
                  {formData.currency}
                </span>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Currency *
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-colors text-lg text-black ${
                errors.currency
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
            {errors.currency && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.currency}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Token *
          </label>
          <select
            id="token"
            value={formData.token}
            onChange={(e) => handleChange("token", e.target.value)}
            className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-colors text-lg text-black ${
              errors.token
                ? "border-red-300 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <option value="USDC">USDC - USD Coin</option>
            <option value="USDT">USDT - Tether</option>
            <option value="DAI">DAI - Dai Stablecoin</option>
          </select>
          {errors.token && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.token}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Note (Optional)
          </label>
          <textarea
            id="note"
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black hover:border-gray-300 transition-colors text-lg text-black"
            placeholder="Add a note to your order"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full flex items-center justify-center space-x-3"
          size="lg"
        >
          {!isSubmitting && (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Create Order</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
});
