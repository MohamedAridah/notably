import { useState } from "react";
import Link from "next/link";
import { updateNoteAction } from "@/server/notes";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { NotebookType } from "@/components/(notes)/move-to-list";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { NotebookIcon } from "lucide-react";

export type NotebookButtonProps = {
  notebook: NotebookType;
  notebooks: NotebookType[];
  currentNotebookId: string;
  noteId: string;
  handleClose?: () => void;
};

const getNotebookName = (notebooks: NotebookType[], id: string) =>
  notebooks.find((nb) => nb.id === id)?.name || "Unknown Notebook";

export const NotebookButton = ({
  notebook,
  notebooks,
  currentNotebookId,
  noteId,
  handleClose,
}: NotebookButtonProps) => {
  const t = useTranslations("MoveNoteList");
  const [isMoving, setIsMoving] = useState(false);

  const handleMoveNote = async (newNotebookId: string) => {
    const position = "top-center";
    setIsMoving(true);

    const toastId = toast.loading(t("toasts.loading"), { position });
    const notebookFrom = getNotebookName(notebooks, currentNotebookId);
    const notebookTo = getNotebookName(notebooks, newNotebookId);

    try {
      const { success } = await updateNoteAction(noteId, {
        notebookId: newNotebookId,
      });
      if (success) {
        toast.success(t("toasts.success"), {
          id: toastId,
          position,
          duration: 6000,
          description: (
            <>
              {t.rich("toasts.successDescription", {
                from: notebookFrom,
                to: notebookTo,
                From: (chunks) => (
                  <Link
                    href={`/dashboard/notebook/${currentNotebookId}`}
                    className="font-bold underline underline-offset-3"
                  >
                    {chunks}
                  </Link>
                ),
                To: (chunks) => (
                  <Link
                    href={`/dashboard/notebook/${newNotebookId}`}
                    className="font-bold underline underline-offset-3"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </>
          ),
        });
        handleClose && handleClose();
      } else {
        toast.error(t("toasts.error"), { position, id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(t("toasts.unexpected"), {
        id: toastId,
        position,
      });
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <button
      key={notebook.id}
      type="button"
      disabled={notebook.id == currentNotebookId || isMoving}
      aria-label={t("moveButtonAriaLabel")}
      className={cn(
        buttonVariants({
          variant: "outline",
          className:
            "flex-col justify-between gap-4 h-auto py-4 !whitespace-normal active:scale-95",
        }),

        notebook.id == currentNotebookId &&
          "disabled:bg-[repeating-linear-gradient(45deg,var(--input),var(--input)_10px,transparent_10px,transparent_20px)] disabled:opacity-80"
      )}
      onClick={() => handleMoveNote(notebook.id)}
    >
      <NotebookIcon className="size-6 text-primary" />
      <span className="font-medium text-sm text-center">{notebook.name}</span>
    </button>
  );
};
