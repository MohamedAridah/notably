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
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSwap from "@/components/utils/loading-swap";
import { useTranslations } from "next-intl";

export type FormMode = "create" | "update";

type FormProps = {
  notebook?: Partial<Notebook>;
  onSubmit: (data: z.infer<typeof NotebookSchema>) => Promise<void>;
  mode?: FormMode;
};

export default function NotebookForm({
  notebook,
  mode = "create",
  onSubmit,
}: FormProps) {
  const t = useTranslations("CreateNotebookForm");
  const form = useForm<z.infer<typeof NotebookSchema>>({
    resolver: zodResolver(NotebookSchema),
    defaultValues: {
      name: notebook?.name || "",
      redirectTo: false,
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

        <FormField
          control={form.control}
          name="redirectTo"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.code === "Enter" || e.key === "Enter") {
                      field.onChange(!field.value);
                      return;
                    }
                  }}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormLabel className="cursor-pointer">
                {mode === "create"
                  ? t("inputs.redirectTo.labelCreate")
                  : t("inputs.redirectTo.labelUpdate")}
              </FormLabel>
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
