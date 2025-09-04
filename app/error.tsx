"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <div className="max-w-md flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">Something went wrong!</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button variant='outline' onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
