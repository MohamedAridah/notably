"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Notebook } from "@prisma/client";
import z from "zod";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
import { authClient } from "@/lib/auth-client";
import { updateNotebookAction } from "@/server/notebooks";
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
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import { PenSquareIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface DialogProps {
  notebookId: string;
  notebook: Partial<Notebook>;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditNotebookDialog({
  notebookId,
  notebook,
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const t = useTranslations("UpdateNotebookButton");
  const tServerCodes = useTranslations("serverCodes.NOTEBOOKS");
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);

  const onSubmit = async (data: z.infer<typeof NotebookSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    try {
      const { success, code } = await updateNotebookAction(notebookId, {
        name: data.name,
      });

      if (success) {
        if (data.redirectTo) {
          router.push(`/dashboard/notebook/${notebookId}`);
        }
        toast.success(tServerCodes(code));
        setIsOpen ? setIsOpen(false) : setDialogState(false);
      } else {
        toast.error(tServerCodes(code));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={isOpen ?? dialogState}
      onOpenChange={setIsOpen ?? setDialogState}
    >
      {withTrigger && (
        <DialogTrigger asChild>
          <DialogTriggerButton
            asIcon={trigger?.asIcon}
            asIconHidden={trigger?.asIconHidden}
            asLabel={trigger?.asLabel}
            icon={PenSquareIcon}
            idleText={t("labelShort")}
            processText={t("labelProcessing")}
            size="sm"
            className="group-hover/notebook-buttons:opacity-100"
            classNameAsIocn="hover:text-green-500"
          />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("labelLong")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <NotebookForm onSubmit={onSubmit} notebook={notebook} mode="update" />
      </DialogContent>
    </Dialog>
  );
}
