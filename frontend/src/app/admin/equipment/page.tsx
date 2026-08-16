"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, ErrorText } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Equipment, Paginated } from "@/lib/types";

export default function AdminEquipmentPage() {
  const { data, loading, refetch } = useApiGet<Paginated<Equipment>>("admin/equipment", { per_page: 50 });
  const { push } = useToast();
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleDelete(item: Equipment) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.del(`admin/equipment/${item.id}`);
      push("Equipment deleted.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to delete.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <Reveal className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Equipment</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="size-4" /> New Equipment
        </Button>
      </Reveal>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No equipment yet" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
              {data.data.map((item) => (
                <StaggerItem key={item.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{item.stock}</td>
                  <td className="px-4 py-3">
                    <Badge tone={item.is_active ? "success" : "neutral"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditing(item); setModalOpen(true); }} className="text-navy-500 hover:text-navy-800">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </StaggerItem>
              ))}
            </Stagger>
          </table>
        )}
      </div>

      <EquipmentModal
        open={modalOpen}
        equipment={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

function EquipmentModal({
  open,
  equipment,
  onClose,
  onSaved,
}: {
  open: boolean;
  equipment: Equipment | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { push } = useToast();
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", is_active: true });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  // Reset local form state whenever a different record (or "new") is opened.
  const key = equipment?.id ?? "new";
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setForm({
      name: equipment?.name ?? "",
      description: equipment?.description ?? "",
      price: equipment ? equipment.price : "",
      stock: equipment ? String(equipment.stock) : "",
      is_active: equipment?.is_active ?? true,
    });
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      is_active: form.is_active,
    };

    try {
      if (equipment) {
        await api.put(`admin/equipment/${equipment.id}`, payload);
        push("Equipment updated.", "success");
      } else {
        await api.post("admin/equipment", payload);
        push("Equipment created.", "success");
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? {});
        push(err.message, "error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={equipment ? "Edit Equipment" : "New Equipment"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="eq_name" required>Name</Label>
          <Input id="eq_name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} />
          <ErrorText>{errors.name?.[0]}</ErrorText>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eq_price" required>Price</Label>
            <Input id="eq_price" type="number" step="0.01" min={0} required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} error={errors.price?.[0]} />
          </div>
          <div>
            <Label htmlFor="eq_stock" required>Stock</Label>
            <Input id="eq_stock" type="number" min={0} required value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} error={errors.stock?.[0]} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="rounded" />
          Active (available for booking)
        </label>
        <Button type="submit" className="w-full" loading={saving}>
          {equipment ? "Save Changes" : "Create Equipment"}
        </Button>
      </form>
    </Modal>
  );
}
