"use client";

import Link from "next/link";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { useAuth } from "@/components/providers/AuthProvider";
import { Reveal } from "@/components/ui/motion";
import type { SystemSettings } from "@/lib/types";

const LABELS: Record<string, string> = {
  site_name: "Site name",
  contact_email: "Contact email",
  contact_phone: "Contact phone",
  tax_rate_percent: "Tax rate (%)",
  default_deposit_percent: "Default deposit (%)",
  booking_lead_time_hours: "Booking lead time (hours)",
  cancellation_window_hours: "Cancellation window (hours)",
};

export default function AdminSettingsPage() {
  const { data, loading } = useApiGet<{ settings: SystemSettings }>("admin/settings");
  const { user } = useAuth();

  if (loading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
      </Reveal>

      <Reveal delay={0.08} className="rounded-xl border border-gray-200 bg-white p-6">
        <dl className="space-y-3 text-sm">
          {Object.entries(LABELS).map(([key, label]) => (
            <div key={key} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-medium text-navy-900">{data?.settings[key] || "—"}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.16}>
        {user?.role === "superadmin" ? (
          <Link href="/superadmin/settings" className="text-sm font-medium text-accent-600 hover:underline">
            Edit these settings →
          </Link>
        ) : (
          <p className="text-sm text-gray-500">Contact a Super Admin to change these settings.</p>
        )}
      </Reveal>
    </div>
  );
}
