"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Pagination({
  page,
  lastPage,
  onChange,
}: {
  page: number;
  lastPage: number;
  onChange: (page: number) => void;
}) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={page}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="text-xs text-gray-500"
        >
          Page {page} of {lastPage}
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-2">
        <motion.button
          whileHover={page > 1 ? { scale: 1.05 } : undefined}
          whileTap={page > 1 ? { scale: 0.95 } : undefined}
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="size-3.5" /> Prev
        </motion.button>
        <motion.button
          whileHover={page < lastPage ? { scale: 1.05 } : undefined}
          whileTap={page < lastPage ? { scale: 0.95 } : undefined}
          onClick={() => onChange(page + 1)}
          disabled={page >= lastPage}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          Next <ChevronRight className="size-3.5" />
        </motion.button>
      </div>
    </div>
  );
}
