"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, titleCase } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Paginated, Payment } from "@/lib/types";

export default function AdminPaymentsPage() {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useApiGet<Paginated<Payment>>("admin/payments", { status: status || undefined, page });
  const { push } = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function confirmPayment(id: number) {
    setBusyId(id);
    try {
      await api.post(`admin/payments/${id}/confirm`);
      push("Payment confirmed.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to confirm payment.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function rejectPayment(id: number) {
    const note = prompt("Reason for rejecting this payment (optional):") ?? "";
    setBusyId(id);
    try {
      await api.post(`admin/payments/${id}/reject`, { reference_note: note || undefined });
      push("Payment rejected.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to reject payment.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Payments</h1>
      </Reveal>

      <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="rejected">Rejected</option>
      </Select>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No payments found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
                  {data.data.map((payment) => (
                    <StaggerItem key={payment.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-900">{payment.payment_number}</td>
                      <td className="px-4 py-3 text-gray-600">{payment.booking?.user?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{payment.booking?.booking_number}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {titleCase(payment.method)}
                        {payment.proof_path && (
                          <a
                            href={api.fileUrl(`admin/payments/${payment.id}/proof`)}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-1 inline-flex align-middle text-gray-400"
                          >
                            <Paperclip className="size-3.5" />
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(payment.created_at)}</td>
                      <td className="px-4 py-3">
                        <Badge status={payment.status}>{payment.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {payment.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => confirmPayment(payment.id)} loading={busyId === payment.id}>
                              <CheckCircle2 className="size-3.5" /> Confirm
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => rejectPayment(payment.id)} disabled={busyId === payment.id}>
                              <XCircle className="size-3.5" /> Reject
                            </Button>
                          </div>
                        )}
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
