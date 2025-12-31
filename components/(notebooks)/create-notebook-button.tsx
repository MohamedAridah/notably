"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { createNotebookAction } from "@/server/notebooks";
import { useMediaQuery } from "@/hooks/use-media-query";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NotebookForm from "@/components/forms/(notebooks)/notebook-form";
import DialogTriggerButton, {
  TriggerProps,
} from "@/components/utils/dialog-trigger-button";
import { NotebookIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface CreateNotebookDialogProps {
  cb?: () => void;
}

export default function CreateNotebookDialog({
  cb,
  ...trigger
}: CreateNotebookDialogProps & Partial<TriggerProps>) {
  const t = useTranslations("CreateNotebookButton");
  const tServerCodes = useTranslations("serverCodes.NOTEBOOKS");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:640px)");

  const idleText = isMobile ? t("labelShort") : t("labelLong");

  const onSubmit = async (data: z.infer<typeof NotebookSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;
    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    const toastId = toast.loading(t("toasts.loading"));
    try {
      const { success, notebookId, code } = await createNotebookAction(
        data.name
      );
      if (success) {
        if (data.redirectTo) {
          router.push(`/dashboard/notebook/${notebookId}`);
          toast.success(t("toasts.success"), {
            id: toastId,
          });
        } else {
          toast.success(tServerCodes(code), { id: toastId });
        }
        setIsOpen(false);
      } else {
        toast.error(tServerCodes(code), { id: toastId });
      }
    } catch (error) {
      console.error("Failed to create notebook: ", error);
      toast.error(t("toasts.errorCreate"), { id: toastId });
    } finally {
      if (cb) cb();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DialogTriggerButton
          asIcon={trigger?.asIcon}
          asIconHidden={trigger?.asIconHidden}
          asLabel={trigger?.asLabel}
          icon={NotebookIcon}
          idleText={idleText}
          processText={t("labelProcessing")}
          size="default"
          className=""
          classNameAsIocn=""
          {...trigger}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("labelLong")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <NotebookForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
