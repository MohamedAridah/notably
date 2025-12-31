import ForgotPasswordForm from "@/components/forms/(auth)/forgot-password-form";

export const metadata = {
  title: "Forgot Password",
  description:
    "Reset your Notably account password. Enter your email to receive password reset instructions and regain access to your notes and notebooks.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
