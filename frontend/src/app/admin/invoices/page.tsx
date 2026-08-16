"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { api } from "@/lib/client/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Invoice, Paginated } from "@/lib/types";

export default function AdminInvoicesPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading } = useApiGet<Paginated<Invoice>>("admin/invoices", { status: status || undefined, page });

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Invoices</h1>
      </Reveal>

      <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-48">
        <option value="">All statuses</option>
        <option value="unpaid">Unpaid</option>
        <option value="partially_paid">Partially Paid</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
        <option value="cancelled">Cancelled</option>
      </Select>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No invoices found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
                  {data.data.map((invoice) => (
                    <StaggerItem key={invoice.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-900">{invoice.invoice_number}</td>
                      <td className="px-4 py-3 text-gray-600">{invoice.booking?.user?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{invoice.booking?.booking_number}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(invoice.due_date)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(invoice.total)}</td>
                      <td className="px-4 py-3">
                        <Badge status={invoice.status}>{invoice.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a href={api.fileUrl(`admin/invoices/${invoice.id}/download`)} target="_blank" rel="noreferrer" className="text-navy-500 hover:text-navy-800">
                          <Download className="size-4" />
                        </a>
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
