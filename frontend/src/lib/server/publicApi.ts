import "server-only";

import { BACKEND_URL } from "@/lib/config";
import type { Paginated, Space } from "@/lib/types";

const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

/**
 * Retries with a per-attempt timeout — the backend can drop or hang on requests
 * under quick, repeated navigation (e.g. flipping between space-type filters),
 * especially over Docker's internal network. Without a timeout, a hung
 * connection would leave the page waiting indefinitely instead of surfacing an
 * error; without retries, a single transient failure was indistinguishable
 * from a genuinely empty result.
 */
async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, { cache: "no-store", signal: controller.signal });
      if (response.ok || attempt === MAX_ATTEMPTS - 1) return response;
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS - 1) throw error;
    } finally {
      clearTimeout(timeout);
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }

  throw lastError;
}

export async function fetchSpaces(params: Record<string, string> = {}): Promise<Paginated<Space>> {
  const query = new URLSearchParams(params).toString();
  const response = await fetchWithRetry(`${BACKEND_URL}/api/spaces${query ? `?${query}` : ""}`);

  if (!response.ok) {
    throw new Error(`Failed to load spaces (${response.status})`);
  }

  return response.json();
}

export async function fetchSpace(id: string): Promise<Space | null> {
  const response = await fetchWithRetry(`${BACKEND_URL}/api/spaces/${id}`);

  if (!response.ok) return null;

  const data = await response.json();
  return data.space as Space;
}
