import ResetPasswordForm from "@/components/forms/(auth)/reset-password-form";
import { Suspense } from "react";

export default function RestePassword() {
  return (
    <Suspense>
      <ResetPasswordForm />;
    </Suspense>
  );
}
