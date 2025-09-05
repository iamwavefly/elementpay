"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Order, OrderStatus } from "@/types";
import { StatusIcon } from "./ui";
import { AlertCircle } from "lucide-react";

interface OrderStatusProps {
  orderId: string;
  onStatusChange: (status: OrderStatus) => void;
  onTimeout: () => void;
}

export const OrderStatusComponent = memo(function OrderStatusComponent({
  orderId,
  onStatusChange,
  onTimeout,
}: OrderStatusProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [hasNotifiedFinalStatus, setHasNotifiedFinalStatus] = useState(false);

  const fetchOrderStatus = useCallback(async (isRetry = false) => {
    try {
      console.log(`Fetching order status for ${orderId}${isRetry ? ' (retry)' : ''}`);
      const response = await fetch(`/api/mock/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Order ${orderId} not found${isRetry ? ' (retry failed)' : ''}`);
          if (isRetry) {
            setError("Order not found");
            setIsPolling(false);
          }
          return;
        }
        throw new Error("Failed to fetch order status");
      }

      const orderData: Order = await response.json();
      console.log(`Order ${orderId} found:`, orderData);
      setOrder(orderData);
      setError(null); // Clear any previous errors

      // Check if order is in final state and we haven't already notified
      if ((orderData.status === "settled" || orderData.status === "failed") && !hasNotifiedFinalStatus) {
        console.log(`Order ${orderId} reached final status: ${orderData.status}`);
        setHasNotifiedFinalStatus(true);
        setIsPolling(false);
        onStatusChange(orderData.status);
      }
    } catch (err) {
      console.error("Error fetching order status:", err);
      if (isRetry) {
        setError("Failed to fetch order status");
      }
    }
  }, [orderId, onStatusChange]);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5; // Increased retries
    
    const attemptInitialFetch = async () => {
      console.log(`Attempting initial fetch for order ${orderId}, attempt ${retryCount + 1}`);
      await fetchOrderStatus();
      
      // If order not found and we haven't exceeded retries, try again
      if (!order && retryCount < maxRetries) {
        retryCount++;
        const delay = Math.min(200 * retryCount, 1000); // Faster retries, max 1s
        console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries + 1})`);
        setTimeout(attemptInitialFetch, delay);
      } else if (!order && retryCount >= maxRetries) {
        console.log(`Max retries exceeded for order ${orderId}`);
      }
    };

    // Start initial fetch attempts with a small delay
    setTimeout(attemptInitialFetch, 100);

    // Set up polling every 3 seconds (only if not already finalized)
    const pollInterval = setInterval(() => {
      if (!hasNotifiedFinalStatus) {
        fetchOrderStatus(true);
      }
    }, 3000);

    // Set up timeout after 60 seconds
    const timeout = setTimeout(() => {
      setIsPolling(false);
      onTimeout();
    }, 60000);

    setTimeoutId(timeout);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [fetchOrderStatus, onTimeout, order, hasNotifiedFinalStatus]);

  // Separate effect to handle polling state changes
  useEffect(() => {
    if (!isPolling) {
      // Clear any existing timeouts when polling stops
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [isPolling, timeoutId]);

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-light text-black mb-2">Error</h3>
        <p className="text-red-600 font-light">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-light text-black mb-2">Loading Order</h3>
        <p className="text-gray-500 font-light">Fetching order status...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <StatusIcon status={order.status} size="md" />
          <h3 className="text-2xl font-light text-black tracking-tight">
            Order Status
          </h3>
        </div>
        {isPolling && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Live</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Order ID
              </span>
              <span className="text-xs text-gray-400">Transaction</span>
            </div>
            <p className="font-mono text-sm text-black break-all">
              {order.order_id}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Amount</span>
              <span className="text-xs text-gray-400">Value</span>
            </div>
            <p className="text-2xl font-light text-black">
              {order.amount} {order.currency}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Token</span>
              <span className="text-xs text-gray-400">Asset</span>
            </div>
            <p className="text-xl font-medium text-black">{order.token}</p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span className="text-xs text-gray-400">Current</span>
            </div>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                order.status === "settled"
                  ? "bg-green-100 text-green-700"
                  : order.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : order.status === "processing"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {order.note && (
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Note</span>
              <span className="text-xs text-gray-400">Additional Info</span>
            </div>
            <p className="text-black font-light">{order.note}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Created</span>
            <span className="text-xs text-gray-400">Timestamp</span>
          </div>
          <p className="text-sm text-gray-600 font-light">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
});
