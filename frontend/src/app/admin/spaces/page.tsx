"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Paginated, Space } from "@/lib/types";

export default function AdminSpacesPage() {
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useApiGet<Paginated<Space>>("admin/spaces", { page });
  const { push } = useToast();

  async function handleDelete(space: Space) {
    if (!confirm(`Delete "${space.name}"? This cannot be undone.`)) return;
    try {
      await api.del(`admin/spaces/${space.id}`);
      push("Space deleted.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to delete space.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <Reveal className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Spaces</h1>
        <Link href="/admin/spaces/new">
          <Button>
            <Plus className="size-4" /> New Space
          </Button>
        </Link>
      </Reveal>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No spaces yet" description="Create your first bookable space." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
                  {data.data.map((space) => (
                    <StaggerItem key={space.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-900">{space.name}</td>
                      <td className="px-4 py-3 capitalize text-gray-600">{space.type}</td>
                      <td className="px-4 py-3 text-gray-600">{space.capacity}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatCurrency(space.price)}/{space.price_unit}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={space.status}>{space.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/spaces/${space.id}/edit`} className="text-navy-500 hover:text-navy-800">
                            <Pencil className="size-4" />
                          </Link>
                          <button onClick={() => handleDelete(space)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="size-4" />
                          </button>
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
