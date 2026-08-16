"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { formatDate, titleCase } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Contract, Paginated } from "@/lib/types";

export default function CustomerContractsPage() {
  const [page, setPage] = useState(1);
  const { data, loading } = useApiGet<Paginated<Contract>>("customer/contracts", { page });

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Contracts</h1>
      </Reveal>

      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No contracts yet" description="Contracts appear here once a booking is approved." />
          </div>
        ) : (
          <>
            <Stagger as="ul" className="divide-y divide-gray-100" stagger={0.03}>
              {data.data.map((contract) => (
                <StaggerItem key={contract.id} as="li" y={8}>
                  <Link href={`/dashboard/contracts/${contract.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-navy-900">{contract.booking?.space?.name}</p>
                      <p className="text-xs text-gray-500">
                        {contract.contract_number} · {formatDate(contract.expiry_date)}
                      </p>
                    </div>
                    <Badge status={contract.status}>{titleCase(contract.status)}</Badge>
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
