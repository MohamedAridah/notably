"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  trashNotebookAction,
  deleteNotebookAction,
  restoreNotebookAction,
} from "@/server/notebooks";
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
import LoadingSwap from "@/components/utils/loading-swap";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export type DeleteNotebookAction = "move-to-trash" | "delete-permanently";

interface DialogProps {
  notebookId: string;
  notebookName: string;
  callbackURL?: string;
  mode?: DeleteNotebookAction;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteNotebookDialog({
  notebookId,
  notebookName,
  callbackURL,
  mode = "move-to-trash",
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const t = useTranslations("DeleteNotebookButton");
  const tServerCodes = useTranslations("serverCodes.NOTEBOOKS");
  const tCommon = useTranslations("Common.actions");
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastAction =
    mode === "move-to-trash"
      ? {
          label: tCommon("undo"),
          onClick: async () => restoreNotebookAction(notebookId),
        }
      : undefined;

  const handleDeleteNotebook = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    setIsDeleting(true);
    try {
      const action =
        mode === "move-to-trash" ? trashNotebookAction : deleteNotebookAction;

      const { success, code } = await action(notebookId);

      if (success) {
        toast.success(tServerCodes(code), { action: toastAction });
        if (callbackURL) router.push(callbackURL);
      } else toast.error(tServerCodes(code));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeleting(false);
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
            variant="destructive"
            size="sm"
            state={isDeleting}
            idleText={t("label")}
            processText={t(`${mode}.processText`)}
            icon={Trash2}
            className="group-hover/notebook-buttons:opacity-100"
            classNameAsIocn="hover:text-red-500"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${mode}.title`)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich(`${mode}.description`, {
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
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNotebook}
          >
            <LoadingSwap isLoading={isDeleting}>
              {t(`${mode}.buttonText`)}
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
