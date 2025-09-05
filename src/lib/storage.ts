import { Order } from "@/types";

// Global storage to ensure persistence across API routes
declare global {
  var __orders: Map<string, Order> | undefined;
}

// Singleton pattern to ensure the same Map instance is used across all API routes
export const orders = (() => {
  if (!global.__orders) {
    global.__orders = new Map<string, Order>();
  }
  return global.__orders;
})();
