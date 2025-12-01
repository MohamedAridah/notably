"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import { updateNoteAction } from "@/server/notes";
import { toast } from "sonner";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Plus } from "lucide-react";
import LoadingSwap from "@/components/utils/loading-swap";

export interface SaveNoteButtonProps {
  noteId: string;
  editor: Editor;
  isThereNewContent: boolean;
  setIsThereNewContent: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveNoteButton = ({
  editor,
  noteId,
  isThereNewContent,
  setIsThereNewContent,
  ...props
}: SaveNoteButtonProps & React.ComponentProps<typeof Button>) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveNoteUpdates = async () => {
    try {
      setIsSaving(true);
      const content = editor.getJSON();
      const { success, message } = await updateNoteAction(noteId, { content });
      if (success) {
        toast.success(message);
        setIsThereNewContent(false);
      } else {
        toast.error("Unable to save new updates!", {
          description: message,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      disabled={isSaving || !isThereNewContent}
      data-style="ghost"
      tooltip="Save note"
      className="hover:cursor-pointer"
      data-disabled={isSaving || !isThereNewContent}
      aria-label={"save note"}
      onClick={handleSaveNoteUpdates}
      {...props}
    >
      <LoadingSwap isLoading={isSaving} loadingText="Saving...">
        <Plus className="size-4" /> Save
      </LoadingSwap>
    </Button>
  );
};

export default SaveNoteButton;
