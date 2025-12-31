"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function useLogout() {
  const t = useTranslations("LogoutButton");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success(t("toasts.success"));
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || t("toasts.error"));
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogout };
}
