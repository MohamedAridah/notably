"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createNoteAction } from "@/server/notes";
import { useMediaQuery } from "@/hooks/use-media-query";
import DialogTriggerButton, {
  TriggerProps,
} from "@/components/utils/dialog-trigger-button";
import { toast } from "sonner";
import { NotepadTextIcon } from "lucide-react";

interface DialogProps {
  notebookId?: string;
}

export default function CreateNoteDialog({
  notebookId,
  ...trigger
}: DialogProps & Partial<TriggerProps>) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:640px)");

  const handleCreateNote = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      toast.promise(createNoteAction(notebookId), {
        loading: "Creating your new note — just a moment...",
        success: ({ noteId, notebookId }) => {
          router.push(`/dashboard/notebook/${notebookId}/note/${noteId}`);
          return { message: "Saved! Jumping to your note now... 🚀" };
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
      icon={NotepadTextIcon}
      idleText={!isMobile ? "Create Note" : "Note"}
      processText="Creating..."
      className="group-hover/note-buttons:opacity-100 group-hover/notebook-buttons:opacity-100"
      classNameAsIocn="hover:text-cyan-500"
      onClick={handleCreateNote}
      {...trigger}
    />
  );
}
