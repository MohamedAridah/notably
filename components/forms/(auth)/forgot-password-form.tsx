"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForgotUserPassword } from "@/server/auth";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/validations/zod/auth-schemas";
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
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordForm() {
  const t = useTranslations("ForgotPasswordForm");
  const tServerCodes = useTranslations("serverCodes.AUTH");
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { replace } = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    const { success, code } = await ForgotUserPassword({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (success) {
      form.reset();
      toast.success(tServerCodes(code), {
        description: t("toasts.success"),
      });
      replace("/verify?process=forgot-password&value=" + data.email);
      return;
    }
    toast.error(tServerCodes(code));
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
