import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { attachAuthCookies } from "@/lib/server/cookies";
import type { User } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();

  const backendResponse = await fetch(`${BACKEND_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const { token, user } = data as { token: string; user: User };

  const response = NextResponse.json({ user });

  return attachAuthCookies(response, token, user.role);
}
