"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { api } from "@/lib/client/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Invoice, Paginated } from "@/lib/types";

export default function CustomerInvoicesPage() {
  const [page, setPage] = useState(1);
  const { data, loading } = useApiGet<Paginated<Invoice>>("customer/invoices", { page });

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Invoices</h1>
      </Reveal>

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No invoices yet" description="Invoices are generated once your booking is approved." />
          </div>
        ) : (
          <>
            <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.03}>
              {data.data.map((invoice) => (
                <StaggerItem key={invoice.id} as="li" y={8} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-navy-900">{invoice.invoice_number}</p>
                    <p className="text-xs text-gray-500">
                      {invoice.booking?.space?.name} · Due {formatDate(invoice.due_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(invoice.total)}</span>
                    <Badge status={invoice.status}>{invoice.status.replace("_", " ")}</Badge>
                    <a
                      href={api.fileUrl(`customer/invoices/${invoice.id}/download`)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-navy-500 hover:text-navy-800"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
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
