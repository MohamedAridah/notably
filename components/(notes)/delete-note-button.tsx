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

interface DialogProps {
  noteId: string;
  callbackURL?: string;
  mode?: DeleteNoteAction;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const dialogTexts = {
  "move-to-trash": {
    title: "Move note to Trash?",
    button: "Move to Trash",
    processText: "Moving...",
  },
  "delete-permanently": {
    title: "Delete note permanently?",
    button: "Delete Forever",
    processText: "Deleting...",
  },
} as const;

export default function DeleteNoteDialog({
  noteId,
  callbackURL,
  mode = "move-to-trash",
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastAction =
    mode === "move-to-trash"
      ? {
          label: "Undo",
          onClick: async () => restoreNoteAction(noteId),
        }
      : undefined;

  const handleDeleteNote = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a notebook.");
      return;
    }

    try {
      setIsDeleting(true);

      const action =
        mode === "move-to-trash" ? trashNoteAction : deleteNoteAction;

      const { success, message } = await action(noteId);

      if (success) {
        toast.success(message, { action: toastAction });
        if (callbackURL) router.push(callbackURL);
      } else toast.error(message);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeleting(false);
      setIsOpen ? setIsOpen(false) : setDialogState(false);
    }
  };

  const text = dialogTexts[mode];

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
            processText={text.processText}
            idleText="Delete"
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
          <AlertDialogTitle>{text.title}</AlertDialogTitle>
          <AlertDialogDescription>
            <AlertDialogDescriptionText mode={mode} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNote}
          >
            <LoadingSwap isLoading={isDeleting}>{text.button}</LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const AlertDialogDescriptionText = ({ mode }: { mode: DeleteNoteAction }) => {
  return mode === "move-to-trash" ? (
    <>This will move note to Trash. You can restore it later.</>
  ) : (
    <>This will permanently delete your note. This action cannot be undone.</>
  );
};
