import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/server/auth";
import { clearAuthCookies } from "@/lib/server/cookies";

export async function POST() {
  const token = await getAuthToken();

  if (token) {
    try {
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
    } catch {
      // Ignore backend errors on logout — always clear local cookies below.
    }
  }

  return clearAuthCookies(NextResponse.json({ message: "Logged out." }));
}
