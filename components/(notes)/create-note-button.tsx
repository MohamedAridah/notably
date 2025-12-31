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
import { useTranslations } from "next-intl";

interface DialogProps {
  notebookId?: string;
}

export default function CreateNoteDialog({
  notebookId,
  ...trigger
}: DialogProps & Partial<TriggerProps>) {
  const t = useTranslations("CreateNoteButton");
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:640px)");

  const handleCreateNote = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    try {
      toast.promise(createNoteAction(notebookId), {
        loading: t("toasts.loading"),
        success: ({ noteId, notebookId }) => {
          router.push(`/dashboard/notebook/${notebookId}/note/${noteId}`);
          return { message: t("toasts.success") };
        },
        error: ({ message }) => {
          return { message };
        },
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("toasts.error"));
    }
  };

  return (
    <DialogTriggerButton
      asIcon={trigger?.asIcon}
      asIconHidden={trigger?.asIconHidden}
      asLabel={trigger?.asLabel}
      icon={NotepadTextIcon}
      idleText={!isMobile ? t("labelLong") : t("labelShort")}
      processText={t("labelProcessing")}
      className="group-hover/note-buttons:opacity-100 group-hover/notebook-buttons:opacity-100"
      classNameAsIocn="hover:text-cyan-500"
      onClick={handleCreateNote}
      {...trigger}
    />
  );
}
