import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "rounded-2xl font-medium transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary: "bg-black text-white hover:bg-gray-800",
      secondary: "bg-gray-100 text-black hover:bg-gray-200",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizeClasses = {
      sm: "py-2 px-4 text-sm",
      md: "py-3 px-6 text-base",
      lg: "py-4 px-12 text-lg",
    };

    return (
      <button
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
