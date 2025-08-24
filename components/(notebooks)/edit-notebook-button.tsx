"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NotebookForm from "@/components/forms/(notebooks)/notebook-form";
import z from "zod";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { updateNotebook } from "@/server/notebooks";
import { Notebook } from "@prisma/client";
import DialogTriggerButton, {
  DialogTriggerButtonType,
} from "../utils/dialog-trigger-button";
import { PenSquareIcon } from "lucide-react";

export default function EditNotebookDialog({
  notebookId,
  notebook,
  asIcon,
  asIconHidden,
  asLabel,
}: {
  notebookId: string;
  notebook: Partial<Notebook>;
} & DialogTriggerButtonType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        setIsOpen(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DialogTriggerButton
          asIcon={asIcon}
          asIconHidden={asIconHidden}
          asLabel={asLabel}
          icon={PenSquareIcon}
          idleText="Update"
          processText="Updating"
          size="sm"
          className="group-hover/notebook-buttons:opacity-100"
          classNameAsIocn="hover:text-green-500 h-full"
        />
      </DialogTrigger>
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
