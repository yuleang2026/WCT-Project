"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, ErrorText } from "@/components/ui/Field";
import { useAuth } from "@/components/providers/AuthProvider";
import { AuthShell } from "@/components/layout/AuthShell";
import { Stagger, StaggerItem, motion } from "@/components/ui/motion";
import type { User } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.email?.[0] ?? data.message ?? "Login failed.");
      }

      const user = data.user as User;
      setUser(user);

      const redirect = searchParams.get("redirect");
      const fallback = user.role === "admin" || user.role === "superadmin" ? "/admin" : "/dashboard";
      router.push(redirect || fallback);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-navy-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to manage your bookings and payments.</p>
      </motion.div>

      <Stagger stagger={0.06}>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <StaggerItem>
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </StaggerItem>
          <StaggerItem>
            <Label htmlFor="password" required>Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </StaggerItem>

          <ErrorText>{error}</ErrorText>

          <StaggerItem>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Log in
            </Button>
          </StaggerItem>
        </form>
      </Stagger>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-accent-600 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
