"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { formatDateTime, titleCase } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { AuditLogEntry, Paginated } from "@/lib/types";

export default function AuditLogsPage() {
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading } = useApiGet<Paginated<AuditLogEntry>>("superadmin/audit-logs", { action: action || undefined, page });

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Audit Logs</h1>
      </Reveal>

      <Input placeholder="Filter by action (e.g. booking.approved)…" value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="w-72" />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No audit log entries found" />
          </div>
        ) : (
          <>
            <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.03}>
              {data.data.map((entry) => (
                <StaggerItem key={entry.id} as="li" y={8} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-navy-900">{titleCase(entry.action.replace(/\./g, " "))}</p>
                    <span className="text-xs text-gray-400">{formatDateTime(entry.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {entry.user?.name ?? "System"} {entry.description ? `· ${entry.description}` : ""} {entry.ip_address ? `· ${entry.ip_address}` : ""}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
            <Pagination page={data.current_page} lastPage={data.last_page} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
