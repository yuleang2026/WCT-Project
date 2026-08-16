"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, ErrorText } from "@/components/ui/Field";
import { useAuth } from "@/components/providers/AuthProvider";
import { AuthShell } from "@/components/layout/AuthShell";
import { Stagger, StaggerItem, motion } from "@/components/ui/motion";
import type { User } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors ?? {});
        throw new Error(data.message ?? "Registration failed.");
      }

      const user = data.user as User;
      setUser(user);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-navy-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Book event spaces and offices at NICC in minutes.</p>
      </motion.div>

      <Stagger stagger={0.05}>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <StaggerItem>
            <Label htmlFor="name" required>Full name</Label>
            <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name?.[0]} />
            <ErrorText>{errors.name?.[0]}</ErrorText>
          </StaggerItem>
          <StaggerItem>
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email?.[0]} />
            <ErrorText>{errors.email?.[0]}</ErrorText>
          </StaggerItem>
          <StaggerItem>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone?.[0]} />
            <ErrorText>{errors.phone?.[0]}</ErrorText>
          </StaggerItem>
          <StaggerItem>
            <Label htmlFor="password" required>Password</Label>
            <Input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} error={errors.password?.[0]} />
            <ErrorText>{errors.password?.[0]}</ErrorText>
          </StaggerItem>
          <StaggerItem>
            <Label htmlFor="password_confirmation" required>Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              required
              value={form.password_confirmation}
              onChange={(e) => update("password_confirmation", e.target.value)}
            />
          </StaggerItem>

          <ErrorText>{error}</ErrorText>

          <StaggerItem>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Create account
            </Button>
          </StaggerItem>
        </form>
      </Stagger>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
