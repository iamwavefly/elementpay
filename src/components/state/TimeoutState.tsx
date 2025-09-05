"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface TimeoutStateProps {
  onRetry: () => void;
}

export function TimeoutState({ onRetry }: TimeoutStateProps) {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-yellow-100 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-light text-black mb-4 tracking-tight">
          Request Timeout
        </h1>
        <p className="text-lg text-gray-500 font-light">
          Your payment took longer than expected to process
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center space-y-6">
          <p className="text-gray-700 font-medium">
            This can happen during high network traffic or when the blockchain
            is congested.
          </p>
          <div className="text-left space-y-2 text-sm text-gray-600">
            <p className="font-medium">What you can do:</p>
            <ul className="space-y-1">
              <li>• Check your wallet for transaction status</li>
              <li>• Try creating a new order</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onRetry} size="lg">
          Try Again
        </Button>
      </div>
    </div>
  );
}
