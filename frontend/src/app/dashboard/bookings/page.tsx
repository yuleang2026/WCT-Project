"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Booking, Paginated } from "@/lib/types";

export default function CustomerBookingsPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading } = useApiGet<Paginated<Booking>>("customer/bookings", {
    status: status || undefined,
    type: type || undefined,
    page,
  });

  return (
    <div className="space-y-6">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-navy-900">My Bookings</h1>
        <Link href="/dashboard/bookings/new">
          <Button>
            <PlusCircle className="size-4" /> New Booking
          </Button>
        </Link>
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
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No bookings found" description="Try adjusting your filters or create a new booking." />
          </div>
        ) : (
          <>
            <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.03}>
              {data.data.map((booking) => (
                <StaggerItem key={booking.id} as="li" y={8}>
                  <Link
                    href={`/dashboard/bookings/${booking.id}`}
                    className="flex flex-col gap-2 px-5 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-navy-900">{booking.space?.name ?? "Space"}</p>
                      <p className="text-xs text-gray-500">
                        {booking.booking_number} · {booking.type === "event" ? "Event" : "Office"} · {formatDate(booking.start_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-navy-800">{formatCurrency(booking.total_price)}</span>
                      <Badge status={booking.status}>{booking.status}</Badge>
                    </div>
                  </Link>
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
