"use client";

import z from "zod";
import { authClient } from "@/lib/auth-client";
import { authSchema } from "@/validations/zod/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSwap from "@/components/utils/loading-swap";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const ProfileUpdateSchema = authSchema.pick({
  name: true,
});

interface UpdateProfileFormProps {
  user: { name: string };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateProfileForm({
  user,
  setIsOpen,
}: UpdateProfileFormProps) {
  const t = useTranslations("UpdateProfileForm");
  const tCommon = useTranslations("Common.actions");
  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    defaultValues: user,
    resolver: zodResolver(ProfileUpdateSchema),
  });

  const handleUpdateProfile = async (
    data: z.infer<typeof ProfileUpdateSchema>
  ) => {
    await authClient.updateUser({
      name: data.name,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || t("toasts.error"));
        },
        onSuccess: () => {
          toast.success(t("toasts.success"));
          setIsOpen(false);
        },
      },
    });
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleUpdateProfile)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inputs.username.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("inputs.username.placeholder")}
                  className="placeholder:text-xs text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="submit"
            size="sm"
            className="rounded-md flex-5 flex-grow"
            disabled={isSubmitting}
          >
            <LoadingSwap isLoading={isSubmitting}>
              {t("submitButton")}
            </LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
