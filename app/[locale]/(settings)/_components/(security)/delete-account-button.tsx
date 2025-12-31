"use client";

import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/utils/loading-swap";
import { ResponsiveDialog } from "@/components/utils/responsive-dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteAccountAction() {
  const t = useTranslations("DeleteAccountButton");
  const tCommon = useTranslations("Common.actions");
  const [isDeleting, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteUser = async () => {
    startTransition(async () => {
      try {
        await authClient.deleteUser({
          callbackURL: "/",
          fetchOptions: {
            onError: ({ error }) => {
              toast.error(error.message || t("toasts.error"));
            },
            onSuccess: () => {
              toast.success(t("toasts.success"), {
                description: t("toasts.successDescription"),
              });
              setIsDeleteOpen(false);
            },
          },
        });
      } catch (error) {
        const e = error as Error;
        toast.error(e.message);
      }
    });
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={t("labelLong")}
        description={t("description")}
        asAlert
      >
        <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 [&_button]:max-sm:w-full">
          <Button
            size={"sm"}
            variant={"destructive"}
            onClick={handleDeleteUser}
            disabled={isDeleting}
            className="sm:order-2"
          >
            <LoadingSwap
              isLoading={isDeleting}
              loadingText={t("labelProcessing")}
            >
              {t("labelShort")}
            </LoadingSwap>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setIsDeleteOpen(false)}
          >
            {tCommon("cancel")}
          </Button>
        </div>
      </ResponsiveDialog>

      <Button
        variant="outline"
        size={"sm"}
        className="text-destructive"
        onClick={() => setIsDeleteOpen(true)}
      >
        {t("triggerLabel")}
      </Button>
    </>
  );
}
