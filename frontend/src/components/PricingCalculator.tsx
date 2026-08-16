"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Users, Clock, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface Space {
  id: number;
  name: string;
  type: "event" | "office";
  capacity: number;
  price: string;
  price_unit: string;
  deposit_amount: string;
}

export function PricingCalculator({ spaces }: { spaces: Space[] }) {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);

  // Automatically select the first space if available
  useEffect(() => {
    if (spaces.length > 0 && !selectedSpaceId) {
      setSelectedSpaceId(spaces[0].id.toString());
    }
  }, [spaces, selectedSpaceId]);

  const selectedSpace = spaces.find((s) => s.id.toString() === selectedSpaceId);

  // Reset duration to 1 when changing space types
  useEffect(() => {
    setDuration(1);
  }, [selectedSpaceId]);

  if (spaces.length === 0) return null;

  const basePrice = selectedSpace ? parseFloat(selectedSpace.price) : 0;
  const deposit = selectedSpace ? parseFloat(selectedSpace.deposit_amount) : 0;
  const totalPrice = basePrice * duration;

  const bookingHref = selectedSpace
    ? selectedSpace.type === "event"
      ? `/dashboard/bookings/new/event?space=${selectedSpace.id}`
      : `/dashboard/bookings/new/office?space=${selectedSpace.id}`
    : "/spaces";

  return (
    <div className="mt-16 rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 p-6 text-white shadow-xl sm:p-8">
      <div className="grid gap-8 md:grid-cols-12 md:items-center">
        {/* Left Side: Inputs */}
        <div className="md:col-span-7">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
              <Calculator className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Dynamic Booking Calculator</h2>
              <p className="text-xs text-navy-200">Estimate your rental cost and required deposit instantly.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="calculator-space" className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                Select Space
              </label>
              <select
                id="calculator-space"
                value={selectedSpaceId}
                onChange={(e) => setSelectedSpaceId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-navy-800 bg-navy-900/60 px-4 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              >
                {spaces.map((s) => (
                  <option key={s.id} value={s.id} className="bg-navy-950 text-white">
                    {s.name} ({s.type === "event" ? "Event Space" : "Office Rental"})
                  </option>
                ))}
              </select>
            </div>

            {selectedSpace && (
              <div>
                <label htmlFor="calculator-duration" className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Duration ({selectedSpace.price_unit === "hour" ? "Hours" : selectedSpace.price_unit === "day" ? "Days" : "Months"})
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="calculator-duration"
                    type="number"
                    min="1"
                    max={selectedSpace.type === "event" ? "48" : "12"}
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 rounded-xl border border-navy-800 bg-navy-900/60 px-4 py-2.5 text-center text-sm font-semibold text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  />
                  <input
                    type="range"
                    min="1"
                    max={selectedSpace.type === "event" ? "24" : "12"}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-navy-800 accent-accent-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Output Pricing Card */}
        <div className="md:col-span-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-wider text-navy-300">Estimated Cost</div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedSpaceId}-${duration}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <div className="text-4xl font-extrabold text-white">
                  {formatCurrency(totalPrice.toString())}
                </div>
                {selectedSpace && (
                  <div className="mt-1 text-xs text-navy-200">
                    Billed at {formatCurrency(selectedSpace.price)} / {selectedSpace.price_unit}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <hr className="my-4 border-white/10" />

            <div className="space-y-2 text-xs text-navy-100">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-navy-300">
                  <ShieldCheck className="size-4 text-accent-400" /> Required Deposit
                </span>
                <span className="font-bold text-white">
                  {selectedSpace ? formatCurrency(selectedSpace.deposit_amount) : "$0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-navy-300">
                  <Users className="size-4 text-accent-400" /> Max Capacity
                </span>
                <span className="font-semibold text-white">
                  {selectedSpace ? `${selectedSpace.capacity} people` : "N/A"}
                </span>
              </div>
            </div>

            <Link href={bookingHref} className="group mt-6 block">
              <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-accent-500/35">
                Book This Space
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
