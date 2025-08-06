"use client";

import z from "zod";
import { authClient } from "@/lib/auth-client";
import { createNote } from "@/server/notes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoteSchema } from "@/validations/zod/note-schemas";
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
import { useSearchParams } from "next/navigation";

export default function NoteForm({ closeForm }: { closeForm: () => void }) {
  const searchParams = useSearchParams();
  console.log(searchParams.keys());

  const form = useForm<z.infer<typeof NoteSchema>>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof NoteSchema>) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      const { success, message } = await createNote(
        data.title,
        data.content as string,
        "c89fb470-d755-4e2e-890a-c0ac69572872"
      );
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Note name..."
                  className="placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input
                  placeholder="Note content..."
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
            "Save Note"
          )}
        </Button>
      </form>
    </Form>
  );
}
