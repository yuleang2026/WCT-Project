"use client";

import { use, useState } from "react";
import { SpaceForm } from "@/components/admin/SpaceForm";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { Label } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/motion";
import type { Space } from "@/lib/types";

export default function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, refetch } = useApiGet<{ space: Space }>(`admin/spaces/${id}`);
  const { push } = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      await api.post(`admin/spaces/${id}/image`, formData);
      push("Image uploaded.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <FullPageSpinner />;
  if (!data) return <p className="text-gray-500">Space not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">Edit Space</h1>
      </Reveal>

      <Reveal delay={0.08} className="rounded-xl border border-gray-200 bg-white p-6">
        <Label>Images</Label>
        <div className="mb-3 flex flex-wrap gap-3">
          {data.space.images?.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="Space" className="size-20 rounded-lg object-cover" />
          ))}
          {(!data.space.images || data.space.images.length === 0) && (
            <p className="text-sm text-gray-400">No images uploaded yet.</p>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="block text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy-700"
        />
      </Reveal>

      <SpaceForm space={data.space} />
    </div>
  );
}
