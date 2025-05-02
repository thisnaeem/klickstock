import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="relative flex items-start group">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              ref={ref}
              {...props}
            />
            <div className={cn(
              "h-5 w-5 rounded",
              "border-2 border-gray-600",
              "bg-gray-800/50",
              "transition-all duration-200",
              "hover:border-gray-500",
              "peer-focus:ring-2 peer-focus:ring-indigo-500/50",
              "peer-checked:bg-indigo-600 peer-checked:border-indigo-600",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              className
            )}>
              <svg
                className="absolute inset-0 h-full w-full text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute -inset-2 rounded-lg bg-indigo-500/20 opacity-0 peer-checked:opacity-100 peer-hover:opacity-40 transition-opacity pointer-events-none" />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <span className="font-medium text-gray-300 select-none">
                {label}
              </span>
            )}
            {description && (
              <p className="text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox }; 