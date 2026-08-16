"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/motion";

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "navy",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  tone?: "navy" | "accent" | "success" | "danger";
}) {
  const toneClasses = {
    navy: "bg-navy-50 text-navy-700",
    accent: "bg-accent-50 text-accent-700",
    success: "bg-emerald-50 text-emerald-700",
    danger: "bg-red-50 text-red-700",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 12px 24px -10px rgba(15,42,82,0.2)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={cn("flex size-10 items-center justify-center rounded-lg", toneClasses)}
        >
          <Icon className="size-5" />
        </motion.span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="text-xl font-bold text-navy-900">
            {typeof value === "number" ? <CountUp value={value} /> : value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
