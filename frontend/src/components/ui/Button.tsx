"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-navy-800 text-white hover:bg-navy-700 focus-visible:outline-navy-800 shadow-sm hover:shadow-md hover:shadow-navy-800/20",
  secondary: "bg-accent-500 text-white hover:bg-accent-600 focus-visible:outline-accent-500 shadow-sm hover:shadow-md hover:shadow-accent-500/30",
  outline: "border border-navy-200 text-navy-800 hover:bg-navy-50 focus-visible:outline-navy-800",
  ghost: "text-navy-700 hover:bg-navy-50 focus-visible:outline-navy-800",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600 shadow-sm hover:shadow-md hover:shadow-red-600/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={disabled || loading ? undefined : { scale: 1.03 }}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {loading && (
            <motion.span
              key="spinner"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Loader2 className="size-4 animate-spin" />
            </motion.span>
          )}
        </AnimatePresence>
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
