import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "dashboard", exact: true },
  { href: "/dashboard/bookings", label: "My Bookings", icon: "calendar" },
  { href: "/dashboard/contracts", label: "Contracts", icon: "contract" },
  { href: "/dashboard/payments", label: "Payments", icon: "payment" },
  { href: "/dashboard/invoices", label: "Invoices", icon: "invoice" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "bell" },
  { href: "/dashboard/profile", label: "Profile", icon: "profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS} brandLabel="Customer Portal">
      {children}
    </DashboardShell>
  );
}
