"use client";

import { useState } from "react";
import { deleteNotebook } from "@/server/notebooks";
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
  DialogTriggerButtonType,
} from "@/components/utils/dialog-trigger-button";
import { useRouter } from "next/navigation";

export default function DeleteNotebookDialog({
  notebookId,
  callbackURL,
  asIcon,
  asIconHidden,
  asLabel,
}: {
  notebookId: string;
  callbackURL?: string;
} & DialogTriggerButtonType) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteNotebook = async () => {
    try {
      setIsDeleting(true);
      const { success, message } = await deleteNotebook(notebookId);
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
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
          asIcon={asIcon}
          asIconHidden={asIconHidden}
          asLabel={asLabel}
          variant="destructive"
          size="sm"
          state={isDeleting}
          idleText="Delete"
          processText="Deleting"
          icon={Trash2}
          className="group-hover/notebook-buttons:opacity-100"
          classNameAsIocn="hover:text-red-500"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this notebook and all its notes. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNotebook}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
