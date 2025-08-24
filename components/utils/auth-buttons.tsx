"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { UserAsIcon } from "../user";

export default function AuthButtons() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Loader2 className="animate-spin size-4 text-foreground" />;
  }

  if (session?.session.userId) {
    return <UserAsIcon />;
  }

  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">
          <span>Login</span>
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">
          <span>Sign Up</span>
        </Link>
      </Button>
    </div>
  );
}
