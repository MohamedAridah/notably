import SignInForm from "@/components/forms/(auth)/login-form";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to your Notably account to access your notes, code snippets, and personal insights.",
};

export default function SignIn() {
  return <SignInForm />;
}
