"use client";

import z from "zod";
import { Notebook } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotebookSchema } from "@/validations/zod/notebook-schemas";
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
import { Loader2 } from "lucide-react";

type FormProps = {
  notebook?: Partial<Notebook>;
  onSubmit: (data: z.infer<typeof NotebookSchema>) => Promise<void>;
};

export default function NotebookForm({ notebook, onSubmit }: FormProps) {
  const form = useForm<z.infer<typeof NotebookSchema>>({
    resolver: zodResolver(NotebookSchema),
    defaultValues: {
      name: notebook?.name || "",
    },
  });
  const isLoading = form.formState.isSubmitting;

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
