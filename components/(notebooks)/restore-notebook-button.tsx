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
import { RotateCwIcon } from "lucide-react";
import { toast } from "sonner";

import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";

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
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const { success, message } = await restoreNotebookAction(notebookId);

      if (success) {
        toast.success(message);
        if (callbackURL) router.push(callbackURL);
      } else toast.error(message);
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
            idleText="Restore"
            processText="Restoring..."
            icon={RotateCwIcon}
            className="group-hover/notebook-buttons:opacity-100"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore Notebook?</AlertDialogTitle>
          <AlertDialogDescription>
            This will restore{" "}
            <span className="font-semibold text-primary">{notebookName}</span>{" "}
            from Trash back to your notebooks.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "secondary" })}
            onClick={handleRestore}
          >
            Restore
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
