"use client";

import Link from "next/link";
import z from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/validations/zod/auth-schemas";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PasswordInput from "@/components/utils/password-input";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Loader2, StarsIcon } from "lucide-react";
import { mapBetterAuthError } from "@/helpers/map-better-auth-error";

export default function SignInForm() {
  const t = useTranslations("LoginForm");
  const tServerCodes = useTranslations("serverCodes.AUTH");
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    await authClient.signIn.email({
      ...data,
      fetchOptions: {
        onError: ({ error }) => {
          const code = mapBetterAuthError(error);
          toast.error(code ? tServerCodes(code) : code);
        },
        onSuccess: () => {
          toast.success(t("toasts.success"));
          router.replace("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("inputs.email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>{t("inputs.password.label")}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="hover:underline text-sm"
                    >
                      {t("inputs.password.forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("inputs.password.placeholder")}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>{t("actions.normal")}</>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                // disabled={isLoading}
                disabled={true}
              >
                {t("actions.google.label")}
                <Badge variant="outline" className="flex items-center">
                  <StarsIcon /> {t("actions.google.badge")}
                </Badge>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-[15px]">
          {t.rich("backToSignUp", {
            signUpLink: (chunks) => (
              <Link href="/auth/sign-up" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
