"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { createNotebookAction } from "@/server/notebooks";
import { useMediaQuery } from "@/hooks/use-media-query";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
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
  TriggerProps,
} from "@/components/utils/dialog-trigger-button";
import { NotebookIcon } from "lucide-react";
import { toast } from "sonner";

interface CreateNotebookDialogProps {
  cb?: () => void;
}

export default function CreateNotebookDialog({
  cb,
  ...trigger
}: CreateNotebookDialogProps & Partial<TriggerProps>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:640px)");

  const idleText = isMobile ? "Notebook" : "Create Notebook";

  const onSubmit = async (data: z.infer<typeof NotebookSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;
    if (!userId) {
      toast.error("You must be signed in to create a notebook.");
      return;
    }

    const toastId = toast.loading(
      "Creating your new notebook — Just a moment..."
    );
    try {
      const { success, notebookId, message } = await createNotebookAction(
        data.name
      );
      if (success) {
        if (data.redirectTo) {
          router.push(`/dashboard/notebook/${notebookId}`);
          toast.success("Done! Jumping to your notebook now... 🚀", {
            id: toastId,
          });
        } else {
          toast.success(message, { id: toastId });
        }
        setIsOpen(false);
      } else {
        toast.error(message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to create notebook: ", error);
      toast.error((error as Error).message, { id: toastId });
    } finally {
      if (cb) cb();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DialogTriggerButton
          asIcon={trigger?.asIcon}
          asIconHidden={trigger?.asIconHidden}
          asLabel={trigger?.asLabel}
          icon={NotebookIcon}
          idleText={idleText}
          processText="Creating"
          size="default"
          className=""
          classNameAsIocn=""
          {...trigger}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>
            Create a new notebook to save your notes.
          </DialogDescription>
        </DialogHeader>

        <NotebookForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
