"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  FileSignature,
  Receipt,
  Download,
  Ban,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, formatTime, titleCase } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import type { Booking } from "@/lib/types";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, refetch } = useApiGet<{ booking: Booking }>(`customer/bookings/${id}`);
  const { push } = useToast();
  const [cancelling, setCancelling] = useState(false);

  if (loading) return <FullPageSpinner />;
  if (!data) return <p className="text-gray-500">Booking not found.</p>;

  const booking = data.booking;

  async function handleCancel() {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(true);
    try {
      await api.post(`customer/bookings/${id}/cancel`);
      push("Booking cancelled.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to cancel booking.", "error");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-900">{booking.space?.name}</h1>
            <Badge status={booking.status}>{booking.status}</Badge>
          </div>
          <p className="text-sm text-gray-500">
            {booking.booking_number} · {booking.type === "event" ? "Event Booking" : "Office Rental"}
          </p>
        </div>
        {(booking.status === "pending" || booking.status === "approved") && (
          <Button variant="danger" size="sm" onClick={handleCancel} loading={cancelling}>
            <Ban className="size-4" /> Cancel Booking
          </Button>
        )}
      </Reveal>

      {booking.status === "rejected" && booking.admin_note && (
        <Reveal delay={0.08} className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Rejection reason</p>
          <p>{booking.admin_note}</p>
        </Reveal>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Reveal as="section" delay={0.16} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
            <CalendarDays className="size-4" /> Schedule
          </h2>
          {booking.type === "event" ? (
            <dl className="space-y-1 text-sm">
              <Row label="Date" value={formatDate(booking.start_date)} />
              <Row label="Time" value={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`} />
              <Row label="Attendees" value={String(booking.attendees ?? "—")} />
            </dl>
          ) : (
            <dl className="space-y-1 text-sm">
              <Row label="Lease start" value={formatDate(booking.start_date)} />
              <Row label="Lease end" value={booking.end_date ? formatDate(booking.end_date) : "Ongoing"} />
            </dl>
          )}
          {booking.purpose && (
            <p className="mt-3 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Notes: </span>
              {booking.purpose}
            </p>
          )}
        </Reveal>

        <Reveal as="section" delay={0.24} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
            <Receipt className="size-4" /> Pricing
          </h2>
          <dl className="space-y-1 text-sm">
            <Row label="Space" value={formatCurrency(booking.space_price)} />
            {parseFloat(booking.equipment_price) > 0 && <Row label="Equipment" value={formatCurrency(booking.equipment_price)} />}
            <Row label="Total" value={formatCurrency(booking.total_price)} bold />
            <Row label="Deposit" value={formatCurrency(booking.deposit_amount)} />
          </dl>
        </Reveal>
      </div>

      {booking.type === "event" && booking.equipment && booking.equipment.length > 0 && (
        <Reveal as="section" delay={0.32} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Equipment</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            {booking.equipment.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} × {item.pivot.quantity}</span>
                <span>{formatCurrency(parseFloat(item.pivot.unit_price) * item.pivot.quantity)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {booking.type === "office" && booking.companyProfile && (
        <Reveal as="section" delay={0.32} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Company Profile</h2>
          <dl className="space-y-1 text-sm">
            <Row label="Company" value={booking.companyProfile.company_name} />
            <Row label="Registration No." value={booking.companyProfile.registration_number ?? "—"} />
            <Row label="Contact" value={`${booking.companyProfile.contact_person} · ${booking.companyProfile.contact_phone}`} />
            <Row label="Email" value={booking.companyProfile.contact_email} />
          </dl>
          {booking.documents && booking.documents.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="mb-2 text-sm font-medium text-gray-800">Documents</p>
              <ul className="space-y-1">
                {booking.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2 text-sm text-navy-700">
                    <FileText className="size-4 text-gray-400" />
                    <span>{titleCase(doc.category)}</span>
                    <span className="text-xs text-gray-400">({doc.original_name})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      )}

      {booking.contract && (
        <Reveal as="section" delay={0.4} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-navy-900">
              <FileSignature className="size-4" /> Contract
            </h2>
            <Badge status={booking.contract.status}>{titleCase(booking.contract.status)}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">{booking.contract.contract_number}</p>
          <Link href={`/dashboard/contracts/${booking.contract.id}`} className="mt-3 inline-block">
            <Button variant="outline" size="sm">
              {booking.contract.status === "pending_signature" ? "Review & Sign" : "View Contract"}
            </Button>
          </Link>
        </Reveal>
      )}

      {booking.invoices && booking.invoices.length > 0 && (
        <Reveal as="section" delay={0.48} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Invoices</h2>
          <ul className="divide-y divide-gray-100">
            {booking.invoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-navy-800">{invoice.invoice_number}</p>
                  <p className="text-xs text-gray-500">Due {formatDate(invoice.due_date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                  <Badge status={invoice.status}>{titleCase(invoice.status)}</Badge>
                  <a
                    href={api.fileUrl(`customer/invoices/${invoice.id}/download`)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-500 hover:text-navy-800"
                  >
                    <Download className="size-4" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/payments" className="mt-3 inline-block">
            <Button size="sm">Make a Payment</Button>
          </Link>
        </Reveal>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className={bold ? "font-semibold text-navy-900" : "text-gray-800"}>{value}</dd>
    </div>
  );
}
