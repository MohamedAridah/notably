"use client";

import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/utils/loading-swap";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

export default function RevokeOtherSessionsButton() {
  const router = useRouter();

  const [isLoading, startTransition] = useTransition();
  const revokeOtherSessions = () => {
    startTransition(async () => {
      await authClient.revokeOtherSessions(undefined, {
        onError: ({ error }) => {
          toast.error(error.message || "Failed to revoke sessions");
        },
        onSuccess: () => {
          toast.success("Sessions revoked successfully");
          router.refresh();
        },
      });
    });
  };
  return (
    <Button
      variant={"destructive"}
      size={"sm"}
      onClick={revokeOtherSessions}
      disabled={isLoading}
    >
      <LoadingSwap isLoading={isLoading}>Revoke Other Sessions</LoadingSwap>
    </Button>
  );
}
