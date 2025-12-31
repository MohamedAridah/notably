"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import { updateNoteAction } from "@/server/notes";
import { toast } from "sonner";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Plus } from "lucide-react";
import LoadingSwap from "@/components/utils/loading-swap";
import { useTranslations } from "next-intl";

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
  const tServerCode = useTranslations("serverCodes.NOTES");
  const t = useTranslations("TextEditor.saveButton");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveNoteUpdates = async () => {
    try {
      setIsSaving(true);
      const content = editor.getJSON();
      const { success, code } = await updateNoteAction(noteId, { content });
      if (success) {
        toast.success(tServerCode(code));
        setIsThereNewContent(false);
      } else {
        toast.error("Unable to save new updates!", {
          description: tServerCode(code),
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
      tooltip={t("labelLong")}
      className="hover:cursor-pointer"
      data-disabled={isSaving || !isThereNewContent}
      aria-label={t("labelLong")}
      onClick={handleSaveNoteUpdates}
      {...props}
    >
      <LoadingSwap isLoading={isSaving} loadingText={t("labelProcessing")}>
        <Plus className="size-4" /> {t("labelShort")}
      </LoadingSwap>
    </Button>
  );
};

export default SaveNoteButton;
