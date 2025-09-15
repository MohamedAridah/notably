"use client";

import { useState } from "react";
import { Notebook } from "@prisma/client";
import z from "zod";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
import { authClient } from "@/lib/auth-client";
import { updateNotebook } from "@/server/notebooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NotebookForm from "@/components/forms/(notebooks)/notebook-form";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import { PenSquareIcon } from "lucide-react";
import { toast } from "sonner";

interface DialogProps {
  notebookId: string;
  notebook: Partial<Notebook>;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditNotebookDialog({
  notebookId,
  notebook,
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const [dialogState, setDialogState] = useState(false);

  const onSubmit = async (data: z.infer<typeof NotebookSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a notebook.");
      return;
    }

    try {
      const { success, message } = await updateNotebook(notebookId, {
        name: data.name,
      });
      if (success) {
        toast.success(message);
        setIsOpen ? setIsOpen(false) : setDialogState(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            icon={PenSquareIcon}
            idleText="Update"
            processText="Updating"
            size="sm"
            className="group-hover/notebook-buttons:opacity-100"
            classNameAsIocn="hover:text-green-500"
          />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Notebook</DialogTitle>
          <DialogDescription>
            Edit the notebook below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <NotebookForm onSubmit={onSubmit} notebook={notebook} />
      </DialogContent>
    </Dialog>
  );
}
