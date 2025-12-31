"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { ResetUserPassword } from "@/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/validations/zod/auth-schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/utils/password-input";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordForm");
  const tServerCodes = useTranslations("serverCodes.AUTH");
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      password__confirm: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  if (!token)
    return (
      <Card className="w-full max-w-md mx-auto gap-4">
        <CardHeader>
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
          <CardDescription className="text-center">
            {t("tokenError")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" asChild>
            <Link href="/" className="rtl:flex-row-reverse">
              <ArrowLeft />
              {t("redirect__home")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    const { success, code } = await ResetUserPassword({
      newPassword: data.password,
      token,
    });

    if (success) {
      form.reset();
      toast.success(tServerCodes(code));
      replace("/auth/sign-in");
      return;
    }
    toast.error(tServerCodes(code) || t("toasts.error"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.newPassword.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("inputs.newPassword.placeholder")}
                      autoComplete="off"
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
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>{t("submitButton")}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-[15px]">
          {t.rich("backToLogin", {
            LogInLink: (chunks) => (
              <Link href="/auth/sign-in" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
