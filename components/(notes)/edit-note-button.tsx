"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NotebookForm from "@/components/forms/(notebooks)/notebook-form";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { type Note } from "@prisma/client";
import DialogTriggerButton, {
  DialogTriggerButtonType,
} from "../utils/dialog-trigger-button";
import { PenSquareIcon } from "lucide-react";
import { updateNote } from "@/server/notes";
import { NoteSchema } from "@/validations/zod/note-schemas";
import NoteForm from "../forms/(notes)/note-form";

export default function EditNoteDialog({
  noteId,
  note,
  asIcon,
  iconHidden,
  withIcon,
}: {
  noteId: string;
  note: Partial<Note>;
} & DialogTriggerButtonType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof NoteSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      const { success, message } = await updateNote(noteId, {
        title: data.title,
      });
      if (success) {
        toast.success(message);
        setIsOpen(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DialogTriggerButton
          asIcon={asIcon}
          iconHidden={iconHidden}
          withIcon={withIcon}
          icon={PenSquareIcon}
          idleText="Update"
          processText="Updating"
          size="sm"
          className="group-hover/note-buttons:opacity-100"
          classNameAsIocn="hover:text-green-500"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Note</DialogTitle>
          <DialogDescription>
            Edit the note below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <NoteForm onSubmit={onSubmit} note={note} />
      </DialogContent>
    </Dialog>
  );
}
