import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: "bookingCheck" },
  { href: "/admin/spaces", label: "Spaces", icon: "building" },
  { href: "/admin/equipment", label: "Equipment", icon: "wrench" },
  { href: "/admin/payments", label: "Payments", icon: "payment" },
  { href: "/admin/invoices", label: "Invoices", icon: "invoice" },
  { href: "/admin/contracts", label: "Contracts", icon: "contract" },
  { href: "/admin/reports", label: "Reports", icon: "chart" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/superadmin/users", label: "Users", icon: "users" },
  { href: "/superadmin/settings", label: "Config", icon: "settings" },
  { href: "/superadmin/audit-logs", label: "Audit Logs", icon: "audit" },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS} brandLabel="Super Admin">
      {children}
    </DashboardShell>
  );
}
