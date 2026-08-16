"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  Bell,
  LayoutDashboard,
  CalendarDays,
  FileSignature,
  CreditCard,
  Receipt,
  UserCog,
  CalendarCheck,
  Building2,
  Wrench,
  BarChart3,
  Settings,
  Users,
  ScrollText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

// Icon *components* (functions) can't be passed as props from a Server
// Component layout to this Client Component — React can't serialize them
// across that boundary. So layouts only pass a serializable icon *key*,
// and this lookup table (which only exists client-side) resolves it.
const ICONS = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  contract: FileSignature,
  payment: CreditCard,
  invoice: Receipt,
  bell: Bell,
  profile: UserCog,
  bookingCheck: CalendarCheck,
  building: Building2,
  wrench: Wrench,
  chart: BarChart3,
  settings: Settings,
  users: Users,
  audit: ScrollText,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export interface NavItem {
  href: string;
  label: string;
  icon: IconKey;
  exact?: boolean;
}

export function DashboardShell({
  navItems,
  brandLabel,
  children,
}: {
  navItems: NavItem[];
  brandLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-900 text-navy-100 transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-navy-800 px-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 rounded-md bg-white px-1.5 py-1"
          >
            <Image src="/brand/nicc-logo.png" alt="NICC" width={96} height={12} className="h-3 w-auto" />
          </motion.div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">SmartSpace</p>
            <p className="text-xs text-navy-400">{brandLabel}</p>
          </div>
        </div>

        <motion.nav
          className="flex flex-col gap-1 px-3 py-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
        >
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const active = isActive(item);
            return (
              <motion.div
                key={item.href}
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-navy-300 hover:bg-navy-800/60 hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-lg bg-navy-800"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="relative size-[18px]" />
                  <span className="relative">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-6 text-navy-900" /> : <Menu className="size-6 text-navy-900" />}
          </motion.button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/dashboard/notifications" className="text-gray-500 hover:text-navy-800">
                <Bell className="size-5" />
              </Link>
            </motion.div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-navy-900">{user?.name}</p>
              <p className="text-xs capitalize text-gray-500">{user?.role}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => logout()}
              className="text-gray-400 hover:text-red-600"
              aria-label="Logout"
            >
              <LogOut className="size-5" />
            </motion.button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
