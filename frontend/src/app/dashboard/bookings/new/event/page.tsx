"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, ErrorText } from "@/components/ui/Field";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import type { Booking, Equipment, Paginated, Space } from "@/lib/types";

function EventBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { push } = useToast();

  const { data: spacesData } = useApiGet<Paginated<Space>>("spaces", { type: "event", per_page: 100 });
  const { data: equipmentData } = useApiGet<{ equipment: Equipment[] }>("equipment");

  const [form, setForm] = useState({
    space_id: searchParams.get("space") ?? "",
    start_date: "",
    start_time: "",
    end_time: "",
    attendees: "",
    purpose: "",
  });
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const spaces = spacesData?.data ?? [];
  const equipment = useMemo(() => equipmentData?.equipment ?? [], [equipmentData]);
  const selectedSpace = spaces.find((s) => String(s.id) === form.space_id);

  const hours = useMemo(() => {
    if (!form.start_time || !form.end_time) return 0;
    const [sh, sm] = form.start_time.split(":").map(Number);
    const [eh, em] = form.end_time.split(":").map(Number);
    const diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
    return diff > 0 ? diff : 0;
  }, [form.start_time, form.end_time]);

  const spacePrice = useMemo(() => {
    if (!selectedSpace) return 0;
    const price = parseFloat(selectedSpace.price);
    return selectedSpace.price_unit === "hour" ? price * hours : price;
  }, [selectedSpace, hours]);

  const equipmentPrice = useMemo(() => {
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const item = equipment.find((e) => e.id === Number(id));
      return item ? sum + parseFloat(item.price) * qty : sum;
    }, 0);
  }, [quantities, equipment]);

  function setQty(id: number, qty: number) {
    setQuantities((q) => {
      const next = { ...q };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const booking = await api.post<{ booking: Booking }>("customer/bookings/event", {
        space_id: Number(form.space_id),
        start_date: form.start_date,
        start_time: form.start_time,
        end_time: form.end_time,
        attendees: Number(form.attendees),
        purpose: form.purpose || undefined,
        equipment: Object.entries(quantities).map(([equipment_id, quantity]) => ({
          equipment_id: Number(equipment_id),
          quantity,
        })),
      });

      push("Booking submitted — awaiting admin approval.", "success");
      router.push(`/dashboard/bookings/${booking.booking.id}`);
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
    <div className="mx-auto max-w-3xl space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Book an Event Space</h1>
        <p className="text-sm text-gray-500">Choose a room, date, time, and any equipment you need.</p>
      </Reveal>

      <Reveal delay={0.08} as="section">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <Label htmlFor="space_id" required>Space</Label>
          <Select
            id="space_id"
            required
            value={form.space_id}
            onChange={(e) => setForm((f) => ({ ...f, space_id: e.target.value }))}
            error={errors.space_id?.[0]}
          >
            <option value="">Select a space…</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} — capacity {space.capacity} — {formatCurrency(space.price)}/{space.price_unit}
              </option>
            ))}
          </Select>
          <ErrorText>{errors.space_id?.[0]}</ErrorText>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="start_date" required>Date</Label>
            <Input
              id="start_date"
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={form.start_date}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              error={errors.start_date?.[0]}
            />
            <ErrorText>{errors.start_date?.[0]}</ErrorText>
          </div>
          <div>
            <Label htmlFor="start_time" required>Start time</Label>
            <Input
              id="start_time"
              type="time"
              required
              value={form.start_time}
              onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
              error={errors.start_time?.[0]}
            />
          </div>
          <div>
            <Label htmlFor="end_time" required>End time</Label>
            <Input
              id="end_time"
              type="time"
              required
              value={form.end_time}
              onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
              error={errors.end_time?.[0]}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="attendees" required>Expected attendees</Label>
          <Input
            id="attendees"
            type="number"
            min={1}
            required
            value={form.attendees}
            onChange={(e) => setForm((f) => ({ ...f, attendees: e.target.value }))}
            error={errors.attendees?.[0]}
          />
          <ErrorText>{errors.attendees?.[0]}</ErrorText>
        </div>

        <div>
          <Label htmlFor="purpose">Purpose / notes</Label>
          <Textarea
            id="purpose"
            value={form.purpose}
            onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
            placeholder="e.g. Annual alumni seminar"
          />
        </div>

        {equipment.length > 0 && (
          <div>
            <Label>Equipment (optional)</Label>
            <div className="space-y-2 rounded-lg border border-gray-200 p-3">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, (quantities[item.id] ?? 0) - 1)}
                      className="flex size-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{quantities[item.id] ?? 0}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, (quantities[item.id] ?? 0) + 1)}
                      className="flex size-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-navy-50 p-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Space rental{hours > 0 ? ` (${hours}h)` : ""}</span>
            <span>{formatCurrency(spacePrice)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Equipment</span>
            <span>{formatCurrency(equipmentPrice)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-navy-100 pt-2 font-semibold text-navy-900">
            <span>Estimated total</span>
            <span>{formatCurrency(spacePrice + equipmentPrice)}</span>
          </div>
          {selectedSpace && parseFloat(selectedSpace.deposit_amount) > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Deposit required upon approval: {formatCurrency(selectedSpace.deposit_amount)}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Submit Booking Request
        </Button>
      </form>
      </Reveal>
    </div>
  );
}

export default function NewEventBookingPage() {
  return (
    <Suspense>
      <EventBookingForm />
    </Suspense>
  );
}
