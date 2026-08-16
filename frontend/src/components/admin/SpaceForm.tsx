"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, ErrorText } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import type { Space } from "@/lib/types";

export function SpaceForm({ space }: { space?: Space }) {
  const router = useRouter();
  const { push } = useToast();

  const [form, setForm] = useState({
    name: space?.name ?? "",
    type: space?.type ?? "event",
    description: space?.description ?? "",
    capacity: space ? String(space.capacity) : "",
    price: space ? space.price : "",
    price_unit: space?.price_unit ?? "hour",
    deposit_amount: space ? space.deposit_amount : "0",
    location: space?.location ?? "",
    amenities: space?.amenities?.join(", ") ?? "",
    status: space?.status ?? "active",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = {
      name: form.name,
      type: form.type,
      description: form.description || undefined,
      capacity: Number(form.capacity),
      price: Number(form.price),
      price_unit: form.price_unit,
      deposit_amount: Number(form.deposit_amount || 0),
      location: form.location || undefined,
      amenities: form.amenities
        ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      status: form.status,
    };

    try {
      if (space) {
        await api.put(`admin/spaces/${space.id}`, payload);
        push("Space updated.", "success");
      } else {
        await api.post("admin/spaces", payload);
        push("Space created.", "success");
      }
      router.push("/admin/spaces");
      router.refresh();
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
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Name</Label>
          <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name?.[0]} />
          <ErrorText>{errors.name?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="type" required>Type</Label>
          <Select id="type" required value={form.type} onChange={(e) => update("type", e.target.value)}>
            <option value="event">Event Space</option>
            <option value="office">Office</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="capacity" required>Capacity</Label>
          <Input id="capacity" type="number" min={0} required value={form.capacity} onChange={(e) => update("capacity", e.target.value)} error={errors.capacity?.[0]} />
        </div>
        <div>
          <Label htmlFor="price" required>Price</Label>
          <Input id="price" type="number" step="0.01" min={0} required value={form.price} onChange={(e) => update("price", e.target.value)} error={errors.price?.[0]} />
        </div>
        <div>
          <Label htmlFor="price_unit" required>Per</Label>
          <Select id="price_unit" required value={form.price_unit} onChange={(e) => update("price_unit", e.target.value)}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="deposit_amount">Deposit amount</Label>
          <Input id="deposit_amount" type="number" step="0.01" min={0} value={form.deposit_amount} onChange={(e) => update("deposit_amount", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="status" required>Status</Label>
          <Select id="status" required value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={form.location} onChange={(e) => update("location", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input id="amenities" value={form.amenities} onChange={(e) => update("amenities", e.target.value)} placeholder="Wi-Fi, Projector, Air Conditioning" />
      </div>

      <Button type="submit" loading={saving} className="w-full">
        {space ? "Save Changes" : "Create Space"}
      </Button>
    </motion.form>
  );
}
