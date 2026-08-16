"use client";

import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api } from "@/lib/client/api";
import { cn, formatDateTime } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { AppNotification, Paginated } from "@/lib/types";

export default function NotificationsPage() {
  const { data, loading, refetch } = useApiGet<Paginated<AppNotification>>("customer/notifications", { per_page: 30 });

  async function markAllRead() {
    await api.post("customer/notifications/read-all");
    refetch();
  }

  async function markRead(id: string) {
    await api.post(`customer/notifications/${id}/read`);
    refetch();
  }

  return (
    <div className="space-y-6">
      <Reveal className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="size-4" /> Mark all read
        </Button>
      </Reveal>

      <Reveal delay={0.08} className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No notifications" description="You're all caught up." />
          </div>
        ) : (
          <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.05}>
            {data.data.map((n) => (
              <StaggerItem key={n.id} as="li" y={10}>
                <div
                  onClick={() => !n.read_at && markRead(n.id)}
                  className={cn("cursor-pointer px-5 py-3 hover:bg-gray-50", !n.read_at && "bg-navy-50/50")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={cn("text-sm", !n.read_at ? "font-medium text-navy-900" : "text-gray-600")}>
                      {n.data.message}
                    </p>
                    {!n.read_at && <span className="mt-1 size-2 shrink-0 rounded-full bg-accent-500" />}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{formatDateTime(n.created_at)}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Reveal>
    </div>
  );
}
