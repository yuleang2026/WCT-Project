"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, Select, ErrorText } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, titleCase } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Invoice, Paginated, Payment } from "@/lib/types";

export default function CustomerPaymentsPage() {
  const { data: payments, loading, refetch } = useApiGet<Paginated<Payment>>("customer/payments", { per_page: 20 });
  const { data: invoices } = useApiGet<Paginated<Invoice>>("customer/invoices", { per_page: 100 });
  const [modalOpen, setModalOpen] = useState(false);

  const payableInvoices = invoices?.data.filter((i) => i.status === "unpaid" || i.status === "partially_paid") ?? [];

  return (
    <div className="space-y-6">
      <Reveal className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Payments</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" /> Submit Payment
        </Button>
      </Reveal>

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !payments || payments.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No payments yet" description="Payments you submit will show up here." />
          </div>
        ) : (
          <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.03}>
            {payments.data.map((payment) => (
              <StaggerItem key={payment.id} as="li" y={8} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-navy-900">{payment.payment_number}</p>
                  <p className="text-xs text-gray-500">
                    {payment.booking?.space?.name} · {titleCase(payment.method)} · {titleCase(payment.type)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  <Badge status={payment.status}>{payment.status}</Badge>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        invoices={payableInvoices}
        onSubmitted={() => {
          setModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

function PaymentModal({
  open,
  onClose,
  invoices,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onSubmitted: () => void;
}) {
  const { push } = useToast();
  const [form, setForm] = useState({ invoice_id: "", amount: "", method: "bank_transfer", type: "deposit", reference_note: "" });
  const [proof, setProof] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedInvoice = invoices.find((i) => String(i.id) === form.invoice_id);

  function selectInvoice(invoiceId: string) {
    const invoice = invoices.find((i) => String(i.id) === invoiceId);
    setForm((f) => ({
      ...f,
      invoice_id: invoiceId,
      amount: invoice ? invoice.total : f.amount,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInvoice) return;
    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append("booking_id", String(selectedInvoice.booking_id));
    data.append("invoice_id", form.invoice_id);
    data.append("amount", form.amount);
    data.append("method", form.method);
    data.append("type", form.type);
    if (form.reference_note) data.append("reference_note", form.reference_note);
    if (proof) data.append("proof", proof);

    try {
      await api.post("customer/payments", data);
      push("Payment submitted — awaiting confirmation.", "success");
      onSubmitted();
      setForm({ invoice_id: "", amount: "", method: "bank_transfer", type: "deposit", reference_note: "" });
      setProof(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? {});
        push(err.message, "error");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Submit a Payment">
      {invoices.length === 0 ? (
        <p className="text-sm text-gray-500">You have no unpaid invoices right now.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="invoice_id" required>Invoice</Label>
            <Select id="invoice_id" required value={form.invoice_id} onChange={(e) => selectInvoice(e.target.value)} error={errors.booking_id?.[0]}>
              <option value="">Select invoice…</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoice_number} — {formatCurrency(invoice.total)} (due {formatDate(invoice.due_date)})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="amount" required>Amount (USD)</Label>
            <Input id="amount" type="number" step="0.01" min="0.01" required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} error={errors.amount?.[0]} />
            <ErrorText>{errors.amount?.[0]}</ErrorText>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="method" required>Method</Label>
              <Select id="method" required value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="qr_payment">QR Payment</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="type" required>Type</Label>
              <Select id="type" required value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="deposit">Deposit</option>
                <option value="full">Full Payment</option>
                <option value="monthly">Monthly</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="reference_note">Reference / transaction note</Label>
            <Input id="reference_note" value={form.reference_note} onChange={(e) => setForm((f) => ({ ...f, reference_note: e.target.value }))} placeholder="e.g. ABA transaction #12345" />
          </div>
          <div>
            <Label htmlFor="proof">Payment proof (optional)</Label>
            <input
              id="proof"
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy-700"
            />
          </div>
          <Button type="submit" className="w-full" loading={submitting}>
            Submit Payment
          </Button>
        </form>
      )}
    </Modal>
  );
}
