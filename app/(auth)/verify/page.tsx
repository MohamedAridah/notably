import { Suspense } from "react";
import VerifyWrapper from "./verify-wrapper";

export default function Verify() {
  return (
    <Suspense>
      <VerifyWrapper />
    </Suspense>
  );
}
