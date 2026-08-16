"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatDate, titleCase } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Contract, Paginated } from "@/lib/types";

export default function AdminContractsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useApiGet<Paginated<Contract>>("admin/contracts", { status: status || undefined, page });
  const { push } = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function regenerate(id: number) {
    setBusyId(id);
    try {
      await api.post(`admin/contracts/${id}/regenerate`);
      push("Contract regenerated.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to regenerate contract.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Contracts</h1>
      </Reveal>

      <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-52">
        <option value="">All statuses</option>
        <option value="pending_signature">Pending Signature</option>
        <option value="signed">Signed</option>
        <option value="expired">Expired</option>
        <option value="cancelled">Cancelled</option>
      </Select>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No contracts found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Contract</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Space</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
                  {data.data.map((contract) => (
                    <StaggerItem key={contract.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-900">{contract.contract_number}</td>
                      <td className="px-4 py-3 text-gray-600">{contract.booking?.user?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{contract.booking?.space?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(contract.expiry_date)}</td>
                      <td className="px-4 py-3">
                        <Badge status={contract.status}>{titleCase(contract.status)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <a href={api.fileUrl(`admin/contracts/${contract.id}/download`)} target="_blank" rel="noreferrer" className="text-navy-500 hover:text-navy-800">
                            <Download className="size-4" />
                          </a>
                          {contract.status !== "signed" && (
                            <Button size="sm" variant="outline" onClick={() => regenerate(contract.id)} loading={busyId === contract.id}>
                              <RefreshCw className="size-3.5" /> Regenerate
                            </Button>
                          )}
                        </div>
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
