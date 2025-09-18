"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import { updateNote } from "@/server/notes";
import { toast } from "sonner";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Loader, Plus } from "lucide-react";

export interface SaveNoteButtonProps {
  noteId: string;
  editor: Editor;
}

const SaveNoteButton = ({ editor, noteId }: SaveNoteButtonProps) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveNoteUpdates = async () => {
    try {
      setIsSaving(true);
      const content = editor.getHTML();
      const { success, message } = await updateNote(noteId, { content });
      if (success) {
        toast.success(message);
      } else {
        toast.error("Unable to save new updates!", {
          description: message,
        });
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to save note updates.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      disabled={isSaving}
      data-style="ghost"
      tooltip="Save note"
      className="hover:cursor-pointer"
      data-disabled={isSaving}
      aria-label={"save note"}
      onClick={handleSaveNoteUpdates}
    >
      {isSaving ? (
        <>
          <Loader className="animate-spin size-4" /> Saving...
        </>
      ) : (
        <>
          <Plus className="size-4" /> Save
        </>
      )}
    </Button>
  );
};

export default SaveNoteButton;
