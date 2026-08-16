"use client";

import { motion } from "framer-motion";
import { GlowOrb } from "@/components/ui/motion";
import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <GlowOrb color="accent" className="-left-20 -top-10 size-72" />
      <GlowOrb color="navy" className="-right-16 bottom-0 size-80" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md lg:max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-xl shadow-navy-900/5 overflow-hidden grid lg:grid-cols-2"
      >
        {/* Left Side: Visual Brand Panel (Desktop only) */}
        <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white">
          {/* Background Image of Campus */}
          <img
            src="/brand/nicc-campus-banner.png"
            alt="NICC Campus"
            className="absolute inset-0 size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-950/80 to-navy-950" />
          
          {/* Brand Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-block text-xl font-bold tracking-tight text-white hover:text-accent-400 transition-colors">
              NICC <span className="text-accent-500">SmartSpace</span>
            </Link>
          </div>

          {/* Branded info and metrics */}
          <div className="relative z-10 mt-auto">
            <span className="rounded-full bg-accent-500/10 border border-accent-500/20 px-3 py-1 text-xs font-semibold text-accent-400">
              National Incubation Center of Cambodia
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white">
              Incubating Cambodia's future startups.
            </h2>
            <p className="mt-3 text-sm text-navy-200">
              Access premium co-working spaces, private offices, training programs, and mentorship networks right inside RUPP campus.
            </p>
            
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <span className="block text-xl font-bold text-accent-400">$310K+</span>
                <span className="text-[10px] uppercase tracking-wider text-navy-300">Seed Funding</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-accent-400">370+</span>
                <span className="text-[10px] uppercase tracking-wider text-navy-300">Mentorships</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-accent-400">20+</span>
                <span className="text-[10px] uppercase tracking-wider text-navy-300">Incubator Partners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
