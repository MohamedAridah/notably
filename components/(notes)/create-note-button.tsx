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
import NoteForm from "@/components/forms/(notes)/note-form";
import { Plus, PlusIcon } from "lucide-react";

import DialogTriggerButton, {
  DialogTriggerButtonType,
} from "../utils/dialog-trigger-button";
import z from "zod";
import { NoteSchema } from "@/validations/zod/note-schemas";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { createNote } from "@/server/notes";

export default function CreateNoteDialog({
  notebookId,
  asIcon,
  asIconHidden,
  asLabel,
}: {
  notebookId: string;
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
      const { success, message } = await createNote(data.title, {}, notebookId);
      if (success) {
        toast.success(message);
        setIsOpen(false);
        return;
      }
      toast.error(message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DialogTriggerButton
          asIcon={asIcon}
          asIconHidden={asIconHidden}
          asLabel={asLabel}
          icon={PlusIcon}
          idleText="Create Note"
          processText="Creating..."
          className="group-hover/note-buttons:opacity-100 group-hover/notebook-buttons:opacity-100"
          classNameAsIocn="hover:text-cyan-500 h-full"
        />
      </DialogTrigger>
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
