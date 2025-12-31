"use client";

import z from "zod";
import { Note } from "@prisma/client";
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
import LoadingSwap from "@/components/utils/loading-swap";
import { useTranslations } from "next-intl";

type FormProps = {
  note?: Partial<Note>;
  onSubmit: (data: z.infer<typeof NoteSchema>) => Promise<void>;
};

export default function NoteForm({ onSubmit, note }: FormProps) {
  const t = useTranslations("UpdateNoteForm");
  const form = useForm<z.infer<typeof NoteSchema>>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: note?.title || "Untitled Note",
    },
  });
  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inputs.name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("inputs.name.placeholder")}
                  className="placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          <LoadingSwap
            isLoading={isLoading}
            loadingText={t("submitButton.loading")}
          >
            {t("submitButton.label")}
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
