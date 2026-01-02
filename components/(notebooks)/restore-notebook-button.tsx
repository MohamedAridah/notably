"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreNotebookAction } from "@/server/notebooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";

interface RestoreNotebookDialogProps {
  notebookId: string;
  notebookName: string;
  callbackURL?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RestoreNotebookDialog({
  notebookId,
  notebookName,
  callbackURL,
  isOpen,
  setIsOpen,
  withTrigger = true,
  trigger,
}: RestoreNotebookDialogProps & TriggerAppearance) {
  const t = useTranslations("RestoreNotebookButton");
  const tServerCodes = useTranslations("serverCodes.NOTEBOOKS");
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const { success, code } = await restoreNotebookAction(notebookId);

      if (success) {
        toast.success(tServerCodes(code));
        if (callbackURL) router.push(callbackURL);
      } else toast.error(tServerCodes(code));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsRestoring(false);
      setIsOpen ? setIsOpen(false) : setDialogState(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen ?? dialogState}
      onOpenChange={setIsOpen ?? setDialogState}
    >
      {withTrigger && (
        <AlertDialogTrigger asChild>
          <DialogTriggerButton
            asIcon={trigger?.asIcon}
            asIconHidden={trigger?.asIconHidden}
            asLabel={trigger?.asLabel}
            variant="secondary"
            size="sm"
            state={isRestoring}
            idleText={t("labelShort")}
            processText={t("labelProcessing")}
            icon={Undo2}
            className="group-hover/notebook-buttons:opacity-100"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("labelLong")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich("description", {
              notebookName,
              NotebookName: (chunks) => (
                <span className="font-semibold text-primary">{chunks}</span>
              ),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction
            className={buttonVariants({ variant: "secondary" })}
            onClick={handleRestore}
          >
            {t("labelShort")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
