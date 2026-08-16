"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Service" },
  { href: "/incubation-program", label: "Incubation Program" },
  { href: "/events", label: "Event" },
  { href: "/ecosystem", label: "Ecosystem Builder" },
  { href: "/about", label: "About Us" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} prefetch={false} className="group relative text-sm font-medium text-gray-600 hover:text-navy-800">
      {label}
      <motion.span
        className="absolute -bottom-1 left-0 h-[2px] w-full origin-left rounded-full bg-navy-800"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </Link>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const dashboardHref = user?.role === "admin" || user?.role === "superadmin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" prefetch={false} className="flex items-center gap-2.5">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }} className="relative h-11 w-[199px] shrink-0 sm:h-14 sm:w-[254px]">
            <Image
              src="/brand/nicc-logo.png"
              alt="NICC — National Incubation Center of Cambodia"
              fill
              sizes="(max-width: 768px) 199px, 254px"
              className="object-contain object-left"
              priority
            />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href={dashboardHref} prefetch={false}>
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="size-4" />
                  {user.role === "customer" ? "My Dashboard" : "Admin Panel"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="size-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" prefetch={false}>
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register" prefetch={false}>
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {open ? <X className="size-6 text-navy-900" /> : <Menu className="size-6 text-navy-900" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-3 px-4 py-3">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} prefetch={false} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700">
                  {link.label}
                </Link>
              ))}
              <hr className="my-1 border-gray-100" />
              {user ? (
                <>
                  <Link href={dashboardHref} prefetch={false} onClick={() => setOpen(false)} className="text-sm font-medium text-navy-800">
                    {user.role === "customer" ? "My Dashboard" : "Admin Panel"}
                  </Link>
                  <button onClick={() => logout()} className="text-left text-sm font-medium text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" prefetch={false} onClick={() => setOpen(false)} className="text-sm font-medium text-navy-800">
                    Log in
                  </Link>
                  <Link href="/register" prefetch={false} onClick={() => setOpen(false)} className="text-sm font-medium text-accent-600">
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
