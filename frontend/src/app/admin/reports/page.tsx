"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, CalendarCheck, DollarSign, Building2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api } from "@/lib/client/api";
import { formatCurrency } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";

interface ReportSummary {
  total_bookings: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  total_revenue: number;
  occupancy_by_space: { id: number; name: string; type: string; bookings_count: number }[];
}

export default function AdminReportsPage() {
  const [range, setRange] = useState({ start_date: "", end_date: "" });
  const { data, loading } = useApiGet<ReportSummary>("admin/reports/summary", {
    start_date: range.start_date || undefined,
    end_date: range.end_date || undefined,
  });

  function query() {
    const params = new URLSearchParams();
    if (range.start_date) params.set("start_date", range.start_date);
    if (range.end_date) params.set("end_date", range.end_date);
    return params.toString();
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
      </Reveal>

      <Reveal delay={0.08} className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <Label htmlFor="start_date">From</Label>
          <Input id="start_date" type="date" value={range.start_date} onChange={(e) => setRange((r) => ({ ...r, start_date: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="end_date">To</Label>
          <Input id="end_date" type="date" value={range.end_date} onChange={(e) => setRange((r) => ({ ...r, end_date: e.target.value }))} />
        </div>
        <div className="flex gap-2">
          <a href={`${api.fileUrl("admin/reports/bookings/excel")}?${query()}`}>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="size-4" /> Bookings (Excel)
            </Button>
          </a>
          <a href={`${api.fileUrl("admin/reports/bookings/pdf")}?${query()}`}>
            <Button variant="outline" size="sm">
              <FileText className="size-4" /> Bookings (PDF)
            </Button>
          </a>
          <a href={`${api.fileUrl("admin/reports/revenue/excel")}?${query()}`}>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="size-4" /> Revenue (Excel)
            </Button>
          </a>
        </div>
      </Reveal>

      {loading ? (
        <FullPageSpinner />
      ) : !data ? (
        <p className="text-gray-500">Unable to load report data.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={CalendarCheck} label="Total Bookings" value={data.total_bookings} />
            <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(data.total_revenue)} tone="success" />
            <StatCard icon={Building2} label="Spaces Tracked" value={data.occupancy_by_space.length} tone="accent" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={0.16} className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 font-semibold text-navy-900">Bookings by Status</h2>
              <ul className="space-y-2 text-sm">
                {Object.entries(data.by_status).map(([status, count]) => (
                  <li key={status} className="flex justify-between capitalize text-gray-600">
                    <span>{status}</span>
                    <span className="font-medium text-navy-900">{count}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.24} className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 font-semibold text-navy-900">Bookings by Type</h2>
              <ul className="space-y-2 text-sm">
                {Object.entries(data.by_type).map(([type, count]) => (
                  <li key={type} className="flex justify-between capitalize text-gray-600">
                    <span>{type}</span>
                    <span className="font-medium text-navy-900">{count}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.32} className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-navy-900">Occupancy by Space</h2>
            <ul className="divide-y divide-gray-100">
              {data.occupancy_by_space.map((space) => (
                <li key={space.id} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-700">{space.name}</span>
                  <span className="font-medium text-navy-900">{space.bookings_count} bookings</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </>
      )}
    </div>
  );
}
