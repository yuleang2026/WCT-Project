"use client";

import { use, useState } from "react";
import { Download, FileSignature } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime, titleCase } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import type { Contract } from "@/lib/types";

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, refetch } = useApiGet<{ contract: Contract }>(`customer/contracts/${id}`);
  const { push } = useToast();
  const [signing, setSigning] = useState(false);
  const [agreed, setAgreed] = useState(false);

  if (loading) return <FullPageSpinner />;
  if (!data) return <p className="text-gray-500">Contract not found.</p>;

  const contract = data.contract;

  async function handleSign() {
    setSigning(true);
    try {
      await api.post(`customer/contracts/${id}/sign`);
      push("Contract signed successfully.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to sign contract.", "error");
    } finally {
      setSigning(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Reveal className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Contract {contract.contract_number}</h1>
          <p className="text-sm text-gray-500">For {contract.booking?.space?.name}</p>
        </div>
        <Badge status={contract.status}>{titleCase(contract.status)}</Badge>
      </Reveal>

      <Reveal delay={0.08} className="rounded-xl border border-gray-200 bg-white p-6">
        <pre className="max-h-[28rem] overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
          {contract.terms}
        </pre>
      </Reveal>

      <Reveal delay={0.16} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={api.fileUrl(`customer/contracts/${id}/download`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-900"
        >
          <Download className="size-4" /> Download PDF
        </a>

        {contract.status === "pending_signature" ? (
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded" />
              I have read and agree to the terms above
            </label>
            <Button onClick={handleSign} loading={signing} disabled={!agreed}>
              <FileSignature className="size-4" /> Sign Contract
            </Button>
          </div>
        ) : contract.status === "signed" ? (
          <p className="text-sm font-medium text-emerald-600">Signed on {formatDateTime(contract.signed_at)}</p>
        ) : null}
      </Reveal>
    </div>
  );
}
