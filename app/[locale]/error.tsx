"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <div className="max-w-md flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">
          {t("something__went__wrong")}
        </h1>
        <p className="text-sm text-muted-foreground">{error.message|| "Internal Server Error"} </p>
        <Button variant="outline" onClick={() => reset()}>
          {t("actions.tryAgain")}
        </Button>
      </div>
    </div>
  );
}
