"use client";

import Link from "next/link";
import { CalendarDays, FileSignature, Receipt, PlusCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Booking, Contract, Invoice, Paginated } from "@/lib/types";

export default function CustomerDashboardPage() {
  const { data: bookings, loading: bookingsLoading } = useApiGet<Paginated<Booking>>("customer/bookings", { per_page: 5 });
  const { data: contracts } = useApiGet<Paginated<Contract>>("customer/contracts", { per_page: 100 });
  const { data: invoices } = useApiGet<Paginated<Invoice>>("customer/invoices", { per_page: 100 });

  const pendingContracts = contracts?.data.filter((c) => c.status === "pending_signature").length ?? 0;
  const unpaidInvoices = invoices?.data.filter((i) => i.status === "unpaid" || i.status === "partially_paid").length ?? 0;

  return (
    <div className="space-y-6">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Welcome back</h1>
          <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your bookings.</p>
        </div>
        <Link href="/dashboard/bookings/new">
          <Button>
            <PlusCircle className="size-4" /> New Booking
          </Button>
        </Link>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarDays} label="Total Bookings" value={bookings?.total ?? "—"} />
        <StatCard icon={FileSignature} label="Contracts to Sign" value={pendingContracts} tone="accent" />
        <StatCard icon={Receipt} label="Unpaid Invoices" value={unpaidInvoices} tone="danger" />
      </div>

      <Reveal delay={0.1} className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-navy-900">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm font-medium text-accent-600 hover:underline">
            View all
          </Link>
        </div>
        {bookingsLoading ? (
          <FullPageSpinner />
        ) : !bookings || bookings.data.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No bookings yet"
              description="Browse available spaces and make your first booking."
              action={
                <Link href="/spaces">
                  <Button variant="outline">Browse Spaces</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.05}>
            {bookings.data.map((booking) => (
              <StaggerItem key={booking.id} as="li" y={10}>
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-navy-900">{booking.space?.name ?? "Space"}</p>
                    <p className="text-xs text-gray-500">
                      {booking.booking_number} · {formatDate(booking.start_date)}
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
        )}
      </Reveal>
    </div>
  );
}
