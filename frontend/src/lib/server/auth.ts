import "server-only";

import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE, BACKEND_URL } from "@/lib/config";
import type { User } from "@/lib/types";

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();

  return store.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { user: User };

    return data.user;
  } catch {
    return null;
  }
}
