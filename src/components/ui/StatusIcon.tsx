import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { OrderStatus } from "@/types";

interface StatusIconProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusIcon({
  status,
  size = "md",
  className = "",
}: StatusIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconProps = {
    className: `${sizeClasses[size]} ${className}`,
  };

  switch (status) {
    case "settled":
      return (
        <CheckCircle
          {...iconProps}
          className={`${iconProps.className} text-green-600`}
        />
      );
    case "failed":
      return (
        <XCircle
          {...iconProps}
          className={`${iconProps.className} text-red-600`}
        />
      );
    case "processing":
      return (
        <Clock
          {...iconProps}
          className={`${iconProps.className} text-blue-600`}
        />
      );
    case "created":
      return (
        <Clock
          {...iconProps}
          className={`${iconProps.className} text-gray-600`}
        />
      );
    default:
      return (
        <AlertCircle
          {...iconProps}
          className={`${iconProps.className} text-gray-600`}
        />
      );
  }
}
