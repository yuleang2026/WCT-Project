"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, ErrorText } from "@/components/ui/Field";
import { useAuth } from "@/components/providers/AuthProvider";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { Reveal } from "@/components/ui/motion";
import type { User } from "@/lib/types";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { push } = useToast();

  const [form, setForm] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [password, setPassword] = useState({ password: "", password_confirmation: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const body: Record<string, string> = { name: form.name, phone: form.phone };
      if (password.password) {
        body.password = password.password;
        body.password_confirmation = password.password_confirmation;
      }
      const data = await api.put<{ user: User }>("profile", body);
      setUser(data.user);
      setPassword({ password: "", password_confirmation: "" });
      push("Profile updated.", "success");
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
    <div className="mx-auto max-w-lg space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Profile</h1>
      </Reveal>

      <Reveal delay={0.08} as="section">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <Label>Email</Label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        <div>
          <Label htmlFor="name" required>Full name</Label>
          <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} />
          <ErrorText>{errors.name?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={errors.phone?.[0]} />
          <ErrorText>{errors.phone?.[0]}</ErrorText>
        </div>

        <hr className="border-gray-100" />
        <p className="text-sm font-medium text-gray-700">Change password (optional)</p>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" value={password.password} onChange={(e) => setPassword((p) => ({ ...p, password: e.target.value }))} error={errors.password?.[0]} />
          <ErrorText>{errors.password?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="password_confirmation">Confirm new password</Label>
          <Input id="password_confirmation" type="password" value={password.password_confirmation} onChange={(e) => setPassword((p) => ({ ...p, password_confirmation: e.target.value }))} />
        </div>

        <Button type="submit" loading={saving} className="w-full">
          Save Changes
        </Button>
      </form>
      </Reveal>
    </div>
  );
}
