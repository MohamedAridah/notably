import SignUpForm from "@/components/forms/(auth)/signup-form";

export const metadata = {
  title: "Sign Up",
  description:
    "Create a Notably account to start capturing, organizing, and linking your notes, code snippets, and personal insights seamlessly.",
};

export default function SignUp() {
  return <SignUpForm />;
}
