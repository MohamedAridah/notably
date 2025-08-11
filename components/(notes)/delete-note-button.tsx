"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNote } from "@/server/notes";
import { toast } from "sonner";
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
import clsx from "clsx";

import DialogTriggerButton, {
  DialogTriggerButtonType,
} from "@/components/utils/dialog-trigger-button";

export default function DeleteNoteDialog({
  noteId,
  callbackURL,
  asIcon,
  iconHidden,
  withIcon,
}: {
  noteId: string;
  callbackURL?: string;
} & DialogTriggerButtonType) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteNote = async () => {
    try {
      setIsDeleting(true);
      const { success, message } = await deleteNote(noteId);
      success ? toast.success(message) : toast.error(message);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
      if (callbackURL) router.push(callbackURL);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DialogTriggerButton
          asIcon={asIcon as boolean}
          iconHidden={iconHidden}
          withIcon={withIcon}
          state={isDeleting}
          processText="Deleting"
          idleText="Delete"
          icon={Trash2}
          variant="destructive"
          size="sm"
          className={clsx("group-hover/note-buttons:opacity-100")}
          classNameAsIocn={clsx("hover:text-red-500 transition-colors")}
        />
      </AlertDialogTrigger>

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
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
