"use client";

import { useRouter } from "next/navigation";
import { duplicateNoteAction } from "@/server/notes";
import IconMenu from "@/components/utils/icon-menu";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CopyIcon } from "lucide-react";

export default function DuplicateNoteButton({
  noteId,
  notebook_url,
}: {
  noteId: string;
  notebook_url: string;
}) {
  const t = useTranslations("NoteOptionsMenu");
  const tActions = useTranslations("Common.actions");
  const tServerCode = useTranslations("serverCodes.NOTES");

  const router = useRouter();

  const handleDuplicateNote = async (noteId: string) => {
    try {
      toast.promise(duplicateNoteAction(noteId), {
        loading: t("toasts.duplicate-loading"),
        success: ({ code, noteId: duplicatedNoteId }) => {
          router.push(`${notebook_url}/note/${duplicatedNoteId}`);
          return { message: tServerCode(code) };
        },
        error: ({ code }) => {
          return { message: tServerCode(code) };
        },
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <IconMenu
      text={tActions("duplicate")}
      icon={<CopyIcon className="size-4" />}
      onClick={async () => await handleDuplicateNote(noteId)}
    />
  );
}
