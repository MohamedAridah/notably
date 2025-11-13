"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { createNotebook } from "@/server/notebooks";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NotebookForm from "@/components/forms/(notebooks)/notebook-form";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";


export default function CreateNotebookDialog({
  buttonStyles,
}: {
  buttonStyles?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:640px)");

  const onSubmit = async (data: z.infer<typeof NotebookSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a notebook.");
      return;
    }

    try {
      const { success, message } = await createNotebook(data.name, userId);
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
        <Button {...buttonStyles}>
          <PlusIcon />
          {!isMobile ? "Create Notebook" : "Notebook"}
        </Button>
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
