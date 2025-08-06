"use client";

import z from "zod";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
import { createNotebook } from "@/server/notebooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NotebookForm({ closeForm }: { closeForm: () => void }) {
  const form = useForm<z.infer<typeof NotebookSchema>>({
    resolver: zodResolver(NotebookSchema),
    defaultValues: {
      name: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

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
        closeForm();
        toast.success(message);
        form.reset();
        return;
      }
      toast.error(message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Notebook name..."
                  className="placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Saving...
            </>
          ) : (
            "Save Notebook"
          )}
        </Button>
      </form>
    </Form>
  );
}
