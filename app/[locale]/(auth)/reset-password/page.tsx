import ResetPasswordForm from "@/components/forms/(auth)/reset-password-form";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password",
  description:
    "Set a new password for your Notably account. Enter and confirm your new password to regain secure access to your notes and notebooks.",
};

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
