"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, ErrorText } from "@/components/ui/Field";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";
import type { Booking, Paginated, Space } from "@/lib/types";

function OfficeBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { push } = useToast();

  const { data: spacesData } = useApiGet<Paginated<Space>>("spaces", { type: "office", per_page: 100 });
  const spaces = spacesData?.data ?? [];

  const [form, setForm] = useState({
    space_id: searchParams.get("space") ?? "",
    start_date: "",
    end_date: "",
    purpose: "",
    company_name: "",
    registration_number: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    address: "",
  });
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedSpace = spaces.find((s) => String(s.id) === form.space_id);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!businessLicense || !idCard) {
      setErrors({
        business_license: businessLicense ? [] : ["Business license is required."],
        id_card: idCard ? [] : ["ID card is required."],
      });
      return;
    }

    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    data.append("business_license", businessLicense);
    data.append("id_card", idCard);
    if (otherDocuments) {
      Array.from(otherDocuments).forEach((file) => data.append("other_documents[]", file));
    }

    try {
      const booking = await api.post<{ booking: Booking }>("customer/bookings/office", data);
      push("Office rental application submitted — awaiting admin review.", "success");
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
        <h1 className="text-2xl font-bold text-navy-900">Rent an Office</h1>
        <p className="text-sm text-gray-500">Provide your company profile and required documents for review.</p>
      </Reveal>

      <Reveal delay={0.08} as="section">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <Label htmlFor="space_id" required>Office</Label>
          <Select id="space_id" required value={form.space_id} onChange={(e) => update("space_id", e.target.value)} error={errors.space_id?.[0]}>
            <option value="">Select an office…</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} — capacity {space.capacity} — {formatCurrency(space.price)}/month
              </option>
            ))}
          </Select>
          <ErrorText>{errors.space_id?.[0]}</ErrorText>
          {selectedSpace && (
            <p className="mt-1 text-xs text-gray-500">
              Security deposit due on approval: {formatCurrency(selectedSpace.deposit_amount)}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="start_date" required>Lease start date</Label>
            <Input
              id="start_date"
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={form.start_date}
              onChange={(e) => update("start_date", e.target.value)}
              error={errors.start_date?.[0]}
            />
            <ErrorText>{errors.start_date?.[0]}</ErrorText>
          </div>
          <div>
            <Label htmlFor="end_date">Lease end date (optional)</Label>
            <Input id="end_date" type="date" value={form.end_date} onChange={(e) => update("end_date", e.target.value)} error={errors.end_date?.[0]} />
            <ErrorText>{errors.end_date?.[0]}</ErrorText>
          </div>
        </div>

        <hr className="border-gray-100" />
        <h2 className="text-sm font-semibold text-navy-900">Company Profile</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company_name" required>Company name</Label>
            <Input id="company_name" required value={form.company_name} onChange={(e) => update("company_name", e.target.value)} error={errors.company_name?.[0]} />
            <ErrorText>{errors.company_name?.[0]}</ErrorText>
          </div>
          <div>
            <Label htmlFor="registration_number">Registration number</Label>
            <Input id="registration_number" value={form.registration_number} onChange={(e) => update("registration_number", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact_person" required>Contact person</Label>
            <Input id="contact_person" required value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} error={errors.contact_person?.[0]} />
            <ErrorText>{errors.contact_person?.[0]}</ErrorText>
          </div>
          <div>
            <Label htmlFor="contact_phone" required>Contact phone</Label>
            <Input id="contact_phone" required value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} error={errors.contact_phone?.[0]} />
            <ErrorText>{errors.contact_phone?.[0]}</ErrorText>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="contact_email" required>Contact email</Label>
            <Input id="contact_email" type="email" required value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} error={errors.contact_email?.[0]} />
            <ErrorText>{errors.contact_email?.[0]}</ErrorText>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Company address</Label>
            <Textarea id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
        </div>

        <hr className="border-gray-100" />
        <h2 className="text-sm font-semibold text-navy-900">Required Documents</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="business_license" required>Business license</Label>
            <input
              id="business_license"
              type="file"
              accept="application/pdf,image/*"
              required
              onChange={(e) => setBusinessLicense(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy-700"
            />
            <ErrorText>{errors.business_license?.[0]}</ErrorText>
          </div>
          <div>
            <Label htmlFor="id_card" required>Representative ID card</Label>
            <input
              id="id_card"
              type="file"
              accept="application/pdf,image/*"
              required
              onChange={(e) => setIdCard(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy-700"
            />
            <ErrorText>{errors.id_card?.[0]}</ErrorText>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="other_documents">Other documents (optional)</Label>
            <input
              id="other_documents"
              type="file"
              multiple
              accept="application/pdf,image/*"
              onChange={(e) => setOtherDocuments(e.target.files)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy-700"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Submit Application
        </Button>
      </form>
      </Reveal>
    </div>
  );
}

export default function NewOfficeBookingPage() {
  return (
    <Suspense>
      <OfficeBookingForm />
    </Suspense>
  );
}
