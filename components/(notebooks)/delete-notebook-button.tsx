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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import LoadingSwap from "../utils/loading-swap";
import { authClient } from "@/lib/auth-client";

export type DeleteNotebookAction = "move-to-trash" | "delete-permanently";

interface DialogProps {
  notebookId: string;
  notebookName: string;
  callbackURL?: string;
  mode?: DeleteNotebookAction;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const dialogTexts = {
  "move-to-trash": {
    title: "Move notebook to Trash?",
    button: "Move to Trash",
    processText: "Moving...",
  },
  "delete-permanently": {
    title: "Delete notebook permanently?",
    button: "Delete Forever",
    processText: "Deleting...",
  },
} as const;

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
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toastAction =
    mode === "move-to-trash"
      ? {
          label: "Undo",
          onClick: async () => restoreNotebookAction(notebookId),
        }
      : undefined;

  const handleDeleteNotebook = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a notebook.");
      return;
    }

    try {
      setIsDeleting(true);

      const action =
        mode === "move-to-trash" ? trashNotebookAction : deleteNotebookAction;

      const { success, message } = await action(notebookId);

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
            variant="destructive"
            size="sm"
            state={isDeleting}
            idleText="Delete"
            processText={text.processText}
            icon={Trash2}
            className="group-hover/notebook-buttons:opacity-100"
            classNameAsIocn="hover:text-red-500"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{text.title}</AlertDialogTitle>

          <AlertDialogDescription>
            <AlertDialogDescriptionText
              mode={mode}
              notebookName={notebookName}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNotebook}
          >
            <LoadingSwap isLoading={isDeleting}>{text.button}</LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const AlertDialogDescriptionText = ({
  mode,
  notebookName,
}: {
  mode: DeleteNotebookAction;
  notebookName: string;
}) => {
  return mode === "move-to-trash" ? (
    <>
      This will move{" "}
      <span className="font-semibold text-primary">{notebookName}</span> and all
      its notes to Trash. You can restore it later.
    </>
  ) : (
    <>
      This will permanently delete{" "}
      <span className="font-semibold text-primary">{notebookName}</span> and all
      its notes. This action cannot be undone.
    </>
  );
};
