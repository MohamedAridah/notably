"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  trashNoteAction,
  deleteNoteAction,
  restoreNoteAction,
} from "@/server/notes";
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
import { DeleteNotebookAction as DeleteNoteAction } from "../(notebooks)/delete-notebook-button";
import LoadingSwap from "@/components/utils/loading-swap";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface DialogProps {
  noteId: string;
  callbackURL?: string;
  mode?: DeleteNoteAction;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteNoteDialog({
  noteId,
  callbackURL,
  mode = "move-to-trash",
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const t = useTranslations("DeleteNoteButton");
  const tServerCodes = useTranslations("serverCodes.NOTES");
  const tCommon = useTranslations("Common.actions");
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastAction =
    mode === "move-to-trash"
      ? {
          label: tCommon('undo'),
          onClick: async () => restoreNoteAction(noteId),
        }
      : undefined;

  const handleDeleteNote = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    try {
      setIsDeleting(true);

      const action =
        mode === "move-to-trash" ? trashNoteAction : deleteNoteAction;

      const { success, code } = await action(noteId);

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
            state={isDeleting}
            processText={t(`${mode}.processText`)}
            idleText={t("label")}
            icon={Trash2}
            variant="destructive"
            size="sm"
            className="group-hover/note-buttons:opacity-100"
            classNameAsIocn="hover:text-red-500 transition-colors"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${mode}.title`)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(`${mode}.description`)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNote}
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
