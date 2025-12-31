"use client";

import z from "zod";
import { authClient } from "@/lib/auth-client";
import { ChangePasswordSchema } from "@/validations/zod/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSwap from "@/components/utils/loading-swap";
import PasswordInput from "@/components/utils/password-input";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const t = useTranslations("ChangePasswordForm");
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    defaultValues: {
      password: "",
      password__new: "",
      password__confirm: "",
      revokeOtherSessions: false,
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  const handlePasswordChange = async (
    data: z.infer<typeof ChangePasswordSchema>
  ) => {
    await authClient.changePassword(
      {
        currentPassword: data.password,
        newPassword: data.password__new,
        revokeOtherSessions: data.revokeOtherSessions,
      },
      {
        onError: ({ error }) => {
          toast.error(error.message || t("toasts.error"));
        },
        onSuccess: () => {
          toast.success(t("toasts.success"));
          form.reset();
        },
      }
    );
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handlePasswordChange)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inputs.currentPassword.label")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("inputs.currentPassword.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password__new"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inputs.newPassword.label")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("inputs.newPassword.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password__confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inputs.confirmPassword.label")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("inputs.confirmPassword.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="revokeOtherSessions"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 hover:cursor-pointer">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t("inputs.revokeSessions.label")}</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="w-full mt-5"
        >
          <LoadingSwap isLoading={isSubmitting}>
            {t("submitButton")}
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
