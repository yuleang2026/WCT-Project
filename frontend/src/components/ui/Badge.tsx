"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

const STATUS_TONE: Record<string, Tone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  cancelled: "neutral",
  completed: "info",
  signed: "success",
  pending_signature: "warning",
  expired: "neutral",
  confirmed: "success",
  unpaid: "warning",
  partially_paid: "info",
  paid: "success",
  overdue: "danger",
  active: "success",
  inactive: "neutral",
  maintenance: "warning",
};

export function Badge({
  children,
  tone,
  status,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  status?: string;
  className?: string;
}) {
  const resolvedTone = tone ?? (status ? STATUS_TONE[status] ?? "neutral" : "neutral");

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClasses[resolvedTone],
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
