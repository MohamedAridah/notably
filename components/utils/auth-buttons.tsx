import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/sign-in">
          <span>Login</span>
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/sign-up">
          <span>Sign Up</span>
        </Link>
      </Button>
    </div>
  );
}
