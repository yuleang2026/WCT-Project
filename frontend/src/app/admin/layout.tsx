import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { getCurrentUser } from "@/lib/server/auth";

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: "bookingCheck" },
  { href: "/admin/spaces", label: "Spaces", icon: "building" },
  { href: "/admin/equipment", label: "Equipment", icon: "wrench" },
  { href: "/admin/payments", label: "Payments", icon: "payment" },
  { href: "/admin/invoices", label: "Invoices", icon: "invoice" },
  { href: "/admin/contracts", label: "Contracts", icon: "contract" },
  { href: "/admin/reports", label: "Reports", icon: "chart" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

const SUPERADMIN_NAV: NavItem[] = [
  { href: "/superadmin/users", label: "Users", icon: "users" },
  { href: "/superadmin/settings", label: "Config", icon: "settings" },
  { href: "/superadmin/audit-logs", label: "Audit Logs", icon: "audit" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const navItems = user?.role === "superadmin" ? [...ADMIN_NAV, ...SUPERADMIN_NAV] : ADMIN_NAV;

  return (
    <DashboardShell navItems={navItems} brandLabel="Admin Panel">
      {children}
    </DashboardShell>
  );
}
