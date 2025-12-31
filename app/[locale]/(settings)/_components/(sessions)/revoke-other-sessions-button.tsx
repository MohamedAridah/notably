"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/utils/loading-swap";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function RevokeOtherSessionsButton() {
  const tRevoke = useTranslations("RevokeSessionButton");
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const revokeOtherSessions = () => {
    startTransition(async () => {
      await authClient.revokeOtherSessions(undefined, {
        onError: ({ error }) => {
          toast.error(error.message || tRevoke("toasts.error", { count: 2 }));
        },
        onSuccess: () => {
          toast.success(tRevoke("toasts.success", { count: 2 }));
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
      <LoadingSwap isLoading={isLoading}>
        {tRevoke("labelLong", { count: 2 })}
      </LoadingSwap>
    </Button>
  );
}
