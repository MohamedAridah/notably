"use client";

import { useState } from "react";
import z from "zod";
import { NoteSchema } from "@/validations/zod/note-schemas";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NoteForm from "@/components/forms/(notes)/note-form";
import DialogTriggerButton, {
  TriggerAppearance,
  TriggerProps,
} from "@/components/utils/dialog-trigger-button";
import { createNote } from "@/server/notes";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

interface DialogProps {
  notebookId?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateNoteDialog({
  notebookId,
  isOpen,
  setIsOpen,
  withTrigger = true,
  ...trigger
}: DialogProps & Partial<TriggerProps> & { withTrigger?: boolean }) {
  const [dialogState, setDialogState] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof NoteSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      const { success, message } = await createNote(data.title, {}, notebookId);
      if (success) {
        toast.success(message);
        setIsOpen ? setIsOpen(false) : setDialogState(false);
        return;
      }
      toast.error(message);
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
            icon={PlusIcon}
            idleText="Create Note"
            processText="Creating..."
            className="group-hover/note-buttons:opacity-100 group-hover/notebook-buttons:opacity-100"
            classNameAsIocn="hover:text-cyan-500"
            {...trigger}
          />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Create a new note to save your thoughts.
          </DialogDescription>
        </DialogHeader>

        <NoteForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
