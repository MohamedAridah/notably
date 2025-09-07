"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNote } from "@/server/notes";
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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";

interface DialogProps {
  noteId: string;
  callbackURL?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteNoteDialog({
  noteId,
  callbackURL,
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteNote = async () => {
    try {
      setIsDeleting(true);
      const { success, message } = await deleteNote(noteId);
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeleting(false);
      setIsOpen ? setIsOpen(false) : setDialogState(false);
      if (callbackURL) router.push(callbackURL);
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
            processText="Deleting"
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNote}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
