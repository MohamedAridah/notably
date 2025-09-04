"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import ThemeToggler from "@/components/utils/theme-toggler";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
              <h1 className="text-xl font-semibold">Something went wrong!</h1>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <button
                onClick={() => reset()}
                className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
              >
                Try again
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
