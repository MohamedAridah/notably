"use client";

import Link from "next/link";
import z from "zod";
import { useRouter } from "next/navigation";
import { SignUpUser } from "@/server/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/validations/zod/auth-schemas";
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
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, StarsIcon } from "lucide-react";

export default function SignUpForm() {
  const t = useTranslations("SignupForm");
  const tServerCodes = useTranslations("serverCodes.AUTH");
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password__confirm: "",
    },
  });
  const { replace } = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    const { success, code } = await SignUpUser(data);
    if (success) {
      form.reset();
      toast.success(t("toasts.success"), {
        description: tServerCodes(code),
      });
      replace("/verify?process=email-verification&value=" + data.email);
      return;
    }
    toast.error(tServerCodes(code));
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("inputs.name.placeholder")}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputs.password.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder={t("inputs.password.placeholder")}
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
                      type="password"
                      placeholder={t("inputs.confirmPassword.placeholder")}
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
