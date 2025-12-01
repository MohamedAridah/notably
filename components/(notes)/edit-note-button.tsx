"use client";

import { useState } from "react";
import { type Note } from "@prisma/client";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { NoteSchema } from "@/validations/zod/note-schemas";
import { updateNoteAction } from "@/server/notes";
import NoteForm from "@/components/forms/(notes)/note-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import { PenSquareIcon } from "lucide-react";
import { toast } from "sonner";

interface DialogProps {
  noteId: string;
  note: Partial<Note>;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditNoteDialog({
  noteId,
  note,
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const [dialogState, setDialogState] = useState(false);

  const onSubmit = async (data: z.infer<typeof NoteSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      const { success, message } = await updateNoteAction(noteId, {
        title: data.title,
      });
      if (success) {
        toast.success(message);
        setIsOpen ? setIsOpen(false) : setDialogState(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={isOpen ?? dialogState}
      onOpenChange={setIsOpen ?? setDialogState}
    >
      {withTrigger && (
        <DialogTrigger asChild>
          <DialogTriggerButton
            asIcon={trigger?.asIcon}
            asIconHidden={trigger?.asIconHidden}
            asLabel={trigger?.asLabel}
            idleText="Update"
            processText="Updating"
            icon={PenSquareIcon}
            size="sm"
            className="group-hover/note-buttons:opacity-100"
            classNameAsIocn="hover:text-green-500"
          />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Note Title</DialogTitle>
          <DialogDescription>
            Edit the note below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <NoteForm onSubmit={onSubmit} note={note} />
      </DialogContent>
    </Dialog>
  );
}
