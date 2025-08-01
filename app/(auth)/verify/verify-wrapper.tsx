"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheckIcon, ShieldAlert } from "lucide-react";

const PROCESSES = ["email-verification", "forgot-password"];

export default function VerifyWrapper() {
  const searchParams = useSearchParams();
  const process = searchParams.get("process");
  const process_value = searchParams.get("value");

  if (!process || !process_value || !PROCESSES.includes(process))
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
          <CardDescription className="text-center">
            Sorry, this verification link is invalid or missing required
            information.
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
  return (
    <Card className="w-full max-w-md mx-auto my-5 text-center gap-4">
      <CardHeader className="text-center">
        <MailCheckIcon className="text-center size-10 mx-auto text-green-500" />
        <CardTitle className="text-2xl mt-3">Verify Email</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          An email has been sent to{" "}
          <span className="font-semibold">{email}</span> Please check your inbox
          for a verification link
        </p>
      </CardContent>
    </Card>
  );
};

const ForgotPasswordSent = ({ email }: { email: string }) => {
  return (
    <Card className="w-full max-w-md mx-auto my-5 text-center gap-4">
      <CardHeader className="text-center">
        <MailCheckIcon className="text-center size-10 mx-auto text-green-500" />
        <CardTitle className="text-2xl mt-3">Reset Password Sent</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          An email has been sent to{" "}
          <span className="font-semibold">{email}</span> Please check your inbox
          for a reset link.
        </p>
      </CardContent>
    </Card>
  );
};
