"use client";

import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, DollarSign, Building2, Clock } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { formatCurrency } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { DashboardStats } from "@/lib/types";

export default function AdminDashboardPage() {
  const { data, loading } = useApiGet<DashboardStats>("admin/dashboard/stats");

  if (loading) return <FullPageSpinner />;
  if (!data) return <p className="text-gray-500">Unable to load dashboard.</p>;

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Total Bookings" value={data.total_bookings} />
        <StatCard icon={DollarSign} label="Revenue (USD)" value={formatCurrency(data.revenue)} tone="success" />
        <StatCard icon={Building2} label="Spaces" value={data.total_spaces} tone="accent" />
        <StatCard icon={Clock} label="Pending" value={data.pending_bookings} tone="danger" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal delay={0.1} className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-navy-900">Booking Trend (last 7 days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.booking_trend}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="count" fill="#1c3560" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-medium text-accent-600 hover:underline">
              View all
            </Link>
          </div>
          <Stagger as="ul" className="space-y-3" stagger={0.06}>
            {data.recent_bookings.map((booking) => (
              <StaggerItem key={booking.id} as="li" y={8}>
                <Link href={`/admin/bookings/${booking.id}`} className="flex items-center justify-between text-sm hover:text-navy-900">
                  <span className="text-gray-700">{booking.space?.name}</span>
                  <Badge status={booking.status}>{booking.status}</Badge>
                </Link>
              </StaggerItem>
            ))}
            {data.recent_bookings.length === 0 && <p className="text-sm text-gray-400">No bookings yet.</p>}
          </Stagger>
        </Reveal>
      </div>
    </div>
  );
}
