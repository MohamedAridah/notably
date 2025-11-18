import { Suspense } from "react";
import VerifyWrapper from "./verify-wrapper";

export const metadata = {
  title: "Verify",
  description:
    "Verify your email address or reset your password. Complete the verification process to secure your Notably account.",
};

export default function Verify() {
  return (
    <Suspense>
      <VerifyWrapper />
    </Suspense>
  );
}
