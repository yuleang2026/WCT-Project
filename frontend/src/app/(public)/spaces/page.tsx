import type { Metadata } from "next";
import { SpaceBrowser } from "@/components/SpaceBrowser";
import { fetchSpaces } from "@/lib/server/publicApi";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = { title: "Browse Spaces" };

export default async function SpacesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { data: spaces } = await fetchSpaces({
    ...(params.type ? { type: params.type } : {}),
    ...(params.search ? { search: params.search } : {}),
    per_page: "24",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold text-navy-900">Browse Spaces</h1>
        <p className="mt-1 text-gray-500">Real-time availability for event halls, meeting rooms, and offices.</p>
      </Reveal>

      <SpaceBrowser initialSpaces={spaces} initialSearch={params.search ?? ""} />
    </div>
  );
}
