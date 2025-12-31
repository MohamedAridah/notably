"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import ThemeToggler from "@/components/utils/theme-toggler";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen w-full items-center justify-center space-y-2">
            <div className="max-w-md flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-semibold">
                {t("something__went__wrong")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {error.message || "Internal Server Error"}
              </p>
              <button
                onClick={() => reset()}
                className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
              >
                {t("actions.tryAgain")}
              </button>
            </div>
          </div>
          <div className="absolute bottom-5 right-5">
            <ThemeToggler />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
