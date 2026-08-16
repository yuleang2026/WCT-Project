"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Select, Input } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Booking, Paginated } from "@/lib/types";

export default function AdminBookingsPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading } = useApiGet<Paginated<Booking>>("admin/bookings", {
    status: status || undefined,
    type: type || undefined,
    search: search || undefined,
    page,
  });

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">All Bookings</h1>
      </Reveal>

      <div className="flex flex-wrap gap-3">
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </Select>
        <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-44">
          <option value="">All types</option>
          <option value="event">Event</option>
          <option value="office">Office</option>
        </Select>
        <Input
          placeholder="Search by booking # or customer…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No bookings found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Space</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
                  {data.data.map((booking) => (
                    <StaggerItem key={booking.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/bookings/${booking.id}`} className="font-medium text-navy-800 hover:underline">
                          {booking.booking_number}
                        </Link>
                        <p className="text-xs capitalize text-gray-400">{booking.type}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{booking.user?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{booking.space?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(booking.start_date)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(booking.total_price)}</td>
                      <td className="px-4 py-3">
                        <Badge status={booking.status}>{booking.status}</Badge>
                      </td>
                    </StaggerItem>
                  ))}
                </Stagger>
              </table>
            </div>
            <Pagination page={data.current_page} lastPage={data.last_page} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
