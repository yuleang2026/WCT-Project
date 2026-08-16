"use client";

import { use, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, FileText, FlagOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Label, Textarea } from "@/components/ui/Field";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, formatTime, titleCase } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import type { Booking } from "@/lib/types";

export default function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, refetch } = useApiGet<{ booking: Booking }>(`admin/bookings/${id}`);
  const { push } = useToast();
  const [busy, setBusy] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (loading) return <FullPageSpinner />;
  if (!data) return <p className="text-gray-500">Booking not found.</p>;

  const booking = data.booking;

  async function approve() {
    setBusy(true);
    try {
      await api.post(`admin/bookings/${id}/approve`);
      push("Booking approved. Contract & invoice generated.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to approve booking.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    if (!rejectReason.trim()) return;
    setBusy(true);
    try {
      await api.post(`admin/bookings/${id}/reject`, { admin_note: rejectReason });
      push("Booking rejected.", "success");
      setRejectOpen(false);
      setRejectReason("");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to reject booking.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function complete() {
    setBusy(true);
    try {
      await api.post(`admin/bookings/${id}/complete`);
      push("Booking marked completed.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to update booking.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-900">{booking.booking_number}</h1>
            <Badge status={booking.status}>{booking.status}</Badge>
          </div>
          <p className="text-sm text-gray-500">
            {booking.space?.name} · {booking.user?.name} ({booking.user?.email})
          </p>
        </div>
        <div className="flex gap-2">
          {booking.status === "pending" && (
            <>
              <Button size="sm" onClick={approve} loading={busy}>
                <CheckCircle2 className="size-4" /> Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => setRejectOpen(true)} disabled={busy}>
                <XCircle className="size-4" /> Reject
              </Button>
            </>
          )}
          {booking.status === "approved" && (
            <Button size="sm" variant="outline" onClick={complete} loading={busy}>
              <FlagOff className="size-4" /> Mark Completed
            </Button>
          )}
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        <Reveal as="section" delay={0.08} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Schedule</h2>
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
          {booking.purpose && <p className="mt-2 text-sm text-gray-600">{booking.purpose}</p>}
        </Reveal>

        <Reveal as="section" delay={0.16} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Pricing</h2>
          <dl className="space-y-1 text-sm">
            <Row label="Space" value={formatCurrency(booking.space_price)} />
            <Row label="Equipment" value={formatCurrency(booking.equipment_price)} />
            <Row label="Total" value={formatCurrency(booking.total_price)} bold />
            <Row label="Deposit" value={formatCurrency(booking.deposit_amount)} />
          </dl>
        </Reveal>
      </div>

      {booking.companyProfile && (
        <Reveal as="section" delay={0.24} className="rounded-xl border border-gray-200 bg-white p-5">
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
                    <FileText className="size-4 text-gray-400" /> {titleCase(doc.category)}
                    <span className="text-xs text-gray-400">({doc.original_name})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      )}

      {booking.contract && (
        <Reveal as="section" delay={0.32} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Contract</h2>
            <Badge status={booking.contract.status}>{titleCase(booking.contract.status)}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">{booking.contract.contract_number}</p>
          <Link href={`/admin/contracts`} className="mt-2 inline-block text-sm font-medium text-accent-600 hover:underline">
            View in Contracts →
          </Link>
        </Reveal>
      )}

      {booking.invoices && booking.invoices.length > 0 && (
        <Reveal as="section" delay={0.4} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Invoices</h2>
          <ul className="divide-y divide-gray-100">
            {booking.invoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between py-2 text-sm">
                <span>{invoice.invoice_number}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                  <Badge status={invoice.status}>{titleCase(invoice.status)}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {booking.payments && booking.payments.length > 0 && (
        <Reveal as="section" delay={0.48} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Payments</h2>
          <ul className="divide-y divide-gray-100">
            {booking.payments.map((payment) => (
              <li key={payment.id} className="flex items-center justify-between py-2 text-sm">
                <span>{payment.payment_number} · {titleCase(payment.method)}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  <Badge status={payment.status}>{payment.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/admin/payments" className="mt-2 inline-block text-sm font-medium text-accent-600 hover:underline">
            Manage payments →
          </Link>
        </Reveal>
      )}

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Booking">
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason" required>Reason for rejection</Label>
            <Textarea id="reason" required value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Space already reserved for maintenance" />
          </div>
          <Button variant="danger" className="w-full" onClick={reject} loading={busy} disabled={!rejectReason.trim()}>
            Confirm Rejection
          </Button>
        </div>
      </Modal>
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
