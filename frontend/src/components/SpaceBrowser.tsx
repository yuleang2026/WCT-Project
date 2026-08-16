"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpaceCard } from "@/components/SpaceCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { Space } from "@/lib/types";

const TYPES = [
  { value: "", label: "All Spaces" },
  { value: "event", label: "Event Spaces" },
  { value: "office", label: "Office Rentals" },
];

export function SpaceBrowser({
  initialSpaces,
  initialSearch,
}: {
  initialSpaces: Space[];
  initialSearch: string;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const activeSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [spaces, setSpaces] = useState(initialSpaces);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const [syncedSearch, setSyncedSearch] = useState(activeSearch);
  if (activeSearch !== syncedSearch) {
    setSyncedSearch(activeSearch);
    setSearchInput(activeSearch);
  }

  const skipNextFetch = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");

    const params = new URLSearchParams({ per_page: "24" });
    if (type) params.set("type", type);
    if (activeSearch) params.set("search", activeSearch);

    fetch(`/api/backend/spaces?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load spaces (${res.status})`);
        return res.json();
      })
      .then((body: { data: Space[] }) => {
        setSpaces(body.data ?? []);
        setStatus("idle");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [type, activeSearch]);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <motion.button
              key={t.value}
              onClick={() => updateParams({ type: t.value })}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                type === t.value ? "text-white" : "text-gray-600 hover:bg-gray-200",
              )}
            >
              {type === t.value && (
                <motion.span
                  layoutId="space-filter-pill"
                  className="absolute inset-0 rounded-full bg-navy-800"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {type !== t.value && <span className="absolute inset-0 rounded-full bg-gray-100" />}
              <span className="relative">{t.label}</span>
            </motion.button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ search: searchInput });
          }}
          className="relative w-full sm:w-64"
        >
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search spaces…"
            className="w-full rounded-full border border-gray-300 py-1.5 pl-9 pr-3 text-sm transition-shadow focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </form>
      </div>

      <AnimatePresence mode="wait">
        {status === "error" ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
            <EmptyState
              icon={WifiOff}
              title="Couldn't load spaces"
              description="The connection to our booking system dropped for a moment — this usually clears up on a retry."
              action={
                <Button variant="primary" onClick={() => updateParams({ type, search: activeSearch })}>
                  Try again
                </Button>
              }
            />
          </motion.div>
        ) : spaces.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
            <EmptyState title="No spaces found" description="Try a different search or filter." />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-8 grid gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3",
              status === "loading" && "opacity-60",
            )}
          >
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
