"use client";

import { useState } from "react";
import { deleteNotebook } from "@/server/notebooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export default function DeleteNotebookDialog({
  notebookId,
}: {
  notebookId: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Notebook</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete notebook. all related notes also
            &apos;ll be deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteNotebook}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2Icon /> Delete
                </>
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
