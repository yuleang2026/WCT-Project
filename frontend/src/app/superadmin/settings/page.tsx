"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { Reveal } from "@/components/ui/motion";
import type { SystemSettings } from "@/lib/types";

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: "site_name", label: "Site name" },
  { key: "contact_email", label: "Contact email", type: "email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "tax_rate_percent", label: "Tax rate (%)", type: "number" },
  { key: "default_deposit_percent", label: "Default deposit (%)", type: "number" },
  { key: "booking_lead_time_hours", label: "Booking lead time (hours)", type: "number" },
  { key: "cancellation_window_hours", label: "Cancellation window (hours)", type: "number" },
];

export default function SuperAdminSettingsPage() {
  const { data, loading } = useApiGet<{ settings: SystemSettings }>("superadmin/settings");
  const { push } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  if (data && !initialized) {
    setForm(
      Object.fromEntries(FIELDS.map((f) => [f.key, data.settings[f.key] ?? ""])),
    );
    setInitialized(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("superadmin/settings", { settings: form });
      push("Settings updated.", "success");
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">System Configuration</h1>
      </Reveal>

      <Reveal delay={0.08} as="section">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type ?? "text"}
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              />
            </div>
          ))}
          <Button type="submit" loading={saving} className="w-full">
            Save Configuration
          </Button>
        </form>
      </Reveal>
    </div>
  );
}
