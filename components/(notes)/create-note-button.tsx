"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createNote } from "@/server/notes";
import DialogTriggerButton, {
  TriggerProps,
} from "@/components/utils/dialog-trigger-button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

interface DialogProps {
  notebookId?: string;
}

export default function CreateNoteDialog({
  notebookId,
  ...trigger
}: DialogProps & Partial<TriggerProps>) {
  const router = useRouter();

  const handleCreateNote = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      toast.promise(createNote({ notebookId }), {
        loading: "Creating new note...",
        success: ({ message, noteId, notebookId }) => {
          router.push(`/dashboard/notebook/${notebookId}/note/${noteId}`);
          return { message };
        },
        error: ({ message }) => {
          return { message };
        },
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create the note!");
    }
  };

  return (
    <DialogTriggerButton
      asIcon={trigger?.asIcon}
      asIconHidden={trigger?.asIconHidden}
      asLabel={trigger?.asLabel}
      icon={PlusIcon}
      idleText="Create Note"
      processText="Creating..."
      className="group-hover/note-buttons:opacity-100 group-hover/notebook-buttons:opacity-100"
      classNameAsIocn="hover:text-cyan-500"
      onClick={handleCreateNote}
      {...trigger}
    />
  );
}
