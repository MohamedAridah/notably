import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="sm">
        <Link href="#">
          <span>Login</span>
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href="#">
          <span>Sign Up</span>
        </Link>
      </Button>
    </div>
  );
}
