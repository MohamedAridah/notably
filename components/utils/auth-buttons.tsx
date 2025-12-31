import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function AuthButtons() {
  const tCommon = useTranslations("Common.actions");
  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/sign-in">
          <span>{tCommon("login")}</span>
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/sign-up">
          <span>{tCommon("signUp")}</span>
        </Link>
      </Button>
    </div>
  );
}
