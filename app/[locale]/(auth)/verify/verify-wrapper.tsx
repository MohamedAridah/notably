"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MailCheckIcon, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

const PROCESSES = ["email-verification", "forgot-password"];

export default function VerifyWrapper() {
  const t = useTranslations("VerifyPage.verify__error");
  const searchParams = useSearchParams();
  const process = searchParams.get("process");
  const process_value = searchParams.get("value");

  if (!process || !process_value || !PROCESSES.includes(process))
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
          <CardDescription className="text-center">
            {t("message")}
          </CardDescription>
        </CardHeader>
      </Card>
    );

  const content =
    process === "email-verification" ? (
      <VerifyEmailSent email={process_value} />
    ) : process === "forgot-password" ? (
      <ForgotPasswordSent email={process_value} />
    ) : null;

  return content;
}

const VerifyEmailSent = ({ email }: { email: string }) => {
  const t = useTranslations("VerifyPage.verify__email");
  return (
    <Card className="w-full max-w-md mx-auto my-5 text-center gap-4">
      <CardHeader className="text-center">
        <MailCheckIcon className="text-center size-10 mx-auto text-green-500" />
        <CardTitle className="text-2xl mt-3">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {t.rich("message", {
            email,
            emailText: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button size="sm" variant="ghost" asChild>
          <Link href="/auth/sign-in" className="underline rtl:flex-row-reverse">
            <ChevronLeft />
            {t("redirect__to")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const ForgotPasswordSent = ({ email }: { email: string }) => {
  const t = useTranslations("VerifyPage.verify__forgotPassword__sent");
  return (
    <Card className="w-full max-w-md mx-auto my-5 text-center gap-4">
      <CardHeader className="text-center">
        <MailCheckIcon className="text-center size-10 mx-auto text-green-500" />
        <CardTitle className="text-2xl mt-3">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {t.rich("message", {
            email,
            emailText: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button size="sm" variant="ghost" asChild>
          <Link href="/auth/sign-in" className="underline rtl:flex-row-reverse">
            <ChevronLeft />
            {t("redirect__to")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
