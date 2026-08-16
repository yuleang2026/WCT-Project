"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Error({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <EmptyState
        icon={WifiOff}
        title="Couldn't load pricing"
        description="The connection to our booking system dropped for a moment — this usually clears up on a retry."
        action={
          <Button variant="primary" onClick={() => unstable_retry()}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
