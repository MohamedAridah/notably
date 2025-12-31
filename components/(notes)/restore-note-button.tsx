"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreNoteAction } from "@/server/notes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import { toast } from "sonner";
import { RotateCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface RestoreNoteDialogProps {
  noteId: string;
  callbackURL?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RestoreNoteDialog({
  noteId,
  callbackURL,
  isOpen,
  setIsOpen,
  withTrigger = true,
  trigger,
}: RestoreNoteDialogProps & TriggerAppearance) {
  const t = useTranslations("RestoreNoteButton");
  const tServerCodes = useTranslations("serverCodes.NOTES");
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const { success, code } = await restoreNoteAction(noteId);

      if (success) {
        toast.success(tServerCodes(code));
        if (callbackURL) router.push(callbackURL);
      } else toast.error(tServerCodes(code));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsRestoring(false);
      setIsOpen ? setIsOpen(false) : setDialogState(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen ?? dialogState}
      onOpenChange={setIsOpen ?? setDialogState}
    >
      {withTrigger && (
        <AlertDialogTrigger asChild>
          <DialogTriggerButton
            asIcon={trigger?.asIcon}
            asIconHidden={trigger?.asIconHidden}
            asLabel={trigger?.asLabel}
            variant="secondary"
            size="sm"
            state={isRestoring}
            idleText={t("labelShort")}
            processText={t("labelProcessing")}
            icon={RotateCwIcon}
            className="group-hover/note-buttons:opacity-100"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("labelLong")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction
            className={buttonVariants({ variant: "secondary" })}
            onClick={handleRestore}
          >
            {t("labelShort")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
