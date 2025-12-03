"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import NotebooksListSkeleton from "@/components/(skeletons)/notebooks-list";
const NotebooksList = dynamic(() => import("./move-to-list"), {
  ssr: false,
  loading: () => <NotebooksListSkeleton />,
});
import { ReplaceIcon } from "lucide-react";

interface DialogProps {
  noteId: string;
  currentNotebookId: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MoveNoteDialog({
  noteId,
  currentNotebookId,
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const [dialogState, setDialogState] = useState(false);

  return (
    <Dialog
      open={isOpen ?? dialogState}
      onOpenChange={setIsOpen ?? setDialogState}
    >
      {withTrigger && (
        <DialogTrigger asChild>
          <DialogTriggerButton
            asIcon={trigger?.asIcon}
            asIconHidden={trigger?.asIconHidden}
            asLabel={trigger?.asLabel}
            idleText="Move"
            processText="Moving"
            icon={ReplaceIcon}
            size="sm"
            className="group-hover/note-buttons:opacity-100"
            classNameAsIocn="hover:text-green-500"
          />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-xl max-h-[75dvh] overflow-x-auto  custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Move Note</DialogTitle>
          <DialogDescription>
            Select a notebook to move the note to.
          </DialogDescription>
        </DialogHeader>
        <NotebooksList
          noteId={noteId}
          currentNotebookId={currentNotebookId}
          handleClose={() =>
            setIsOpen ? setIsOpen(false) : setDialogState(false)
          }
        />
      </DialogContent>
    </Dialog>
  );
}
