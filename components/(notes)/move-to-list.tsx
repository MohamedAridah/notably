"use client";

import { useEffect, useState, useTransition } from "react";
import { updateNoteAction } from "@/server/notes";
import { getNotebooks } from "@/helpers/get-notebooks-client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import CreateNotebookDialog from "../(notebooks)/create-notebook-button";
import { toast } from "sonner";
import {
  Loader2Icon,
  NotebookIcon,
  ShieldAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";

interface NotebooksListProps {
  currentNotebookId: string;
  noteId: string;
  handleClose?: () => void;
}

const NotebooksList = ({
  noteId,
  handleClose,
  currentNotebookId,
}: NotebooksListProps) => {
  console.log("NotebooksList Rendered");

  const [isLoading, startTransition] = useTransition();
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [notebooks, setNotebooks] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isNewNotebookCreated, setIsNewNotebookCreated] = useState<
    boolean | number
  >(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const { success, error, notebooks } = await getNotebooks();
        if (success) {
          setNotebooks(notebooks);
        } else {
          setError(error);
        }
      } catch (error) {
        const e = error as Error;
        setError(e.message || "Failed to fetch notebooks.");
      }
    });
  }, [isNewNotebookCreated]);

  const handleMoveNote = async (newNotebookId: string) => {
    const position = "top-center";
    setIsMoving(true);
    const toastId = toast.loading("Moving note...", { position });
    const notebookFrom = getNotebookName(currentNotebookId);
    const notebookTo = getNotebookName(newNotebookId);

    try {
      const { success } = await updateNoteAction(noteId, {
        notebookId: newNotebookId,
      });
      if (success) {
        toast.success("Note moved successfully!", {
          id: toastId,
          position,
          duration: 6000,
          description: <ToastDescription from={notebookFrom} to={notebookTo} />,
        });
        handleClose && handleClose();
      } else {
        toast.error("Failed to move note.", { position, id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred while moving the note.", {
        id: toastId,
        position,
      });
    } finally {
      setIsMoving(false);
    }
  };

  const getNotebookName = (id: string) =>
    notebooks.find((nb) => nb.id === id)?.name || "Unknown Notebook";

  if (error) {
    return (
      <div className="flex flex-col items-center gap-1 mt-4 py-5">
        <ShieldAlertIcon className="size-5" />
        <span className="text-sm text-muted-foreground">{error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-1 mt-4 py-5">
        <Loader2Icon className="size-5 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Getting notebooks...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-end">
      <div className="flex items-center justify-between gap-2 w-full">
        {notebooks.length <= 1 && (
          <p className="flex items-center gap-1text-sm text-orange-500">
            <TriangleAlertIcon className="size-4" /> You need at least two
            notebooks to move this note.
          </p>
        )}
        <CreateNotebookDialog
          size="sm"
          className="ml-auto"
          cb={() => setIsNewNotebookCreated((prev) => +prev + 1)}
        />
      </div>
      <div className="w-full grid md:grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4 items-start mt-4 py-5">
        {notebooks.map((notebook) => (
          <button
            key={notebook.id}
            role="button"
            disabled={notebook.id == currentNotebookId || isMoving}
            aria-label="Select this notebook to move the note to."
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "flex-col justify-between gap-4 h-auto py-4 !whitespace-normal active:scale-95",
              }),

              notebook.id == currentNotebookId &&
                "disabled:bg-[repeating-linear-gradient(45deg,#ff8904,#ff8904_10px,transparent_10px,transparent_20px)] disabled:opacity-80"
            )}
            onClick={() => handleMoveNote(notebook.id)}
          >
            <NotebookIcon className="size-6 text-primary" />
            <span className="font-medium text-sm text-center">
              {notebook.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotebooksList;

const ToastDescription = ({ from, to }: { from: string; to: string }) => {
  return (
    <div>
      Moved from <span className="font-bold">{from}</span> to{" "}
      <span className="font-bold">{to}</span>
    </div>
  );
};
