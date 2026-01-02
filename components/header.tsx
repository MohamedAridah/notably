"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/utils/logo";
import ThemeToggler from "@/components/utils/theme-toggler";
import MobileSheet from "@/components/utils/mobile-sheet";
import NavLinks from "@/components/utils/nav-links";
import AuthButtons from "@/components/utils/auth-buttons";
import { SheetFooter } from "@/components/ui/sheet";
import { UserAsIcon, UserMenuLink } from "@/components/user";
import LocaleSwitcher from "@/components/utils/locale-switcher";
import { Loader2 } from "lucide-react";

export const HeroHeader = ({
  menuLinks,
  ...props
}: React.ComponentProps<"nav"> & { menuLinks?: UserMenuLink[] }) => {
  const { data: session, isPending } = authClient.useSession();
  const authenticated = session?.session?.userId;

  const [scrolled, setScrolled] = React.useState<boolean>(false);

  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const t = useTranslations("Header");
  return (
    <header>
      <nav
        className={cn(
          "fixed z-20 w-full border-b transition-colors duration-150",
          scrolled && "bg-background/50 backdrop-blur-3xl",
          props.className
        )}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 transition-all duration-300">
          <div className="relative flex items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label={t("logoLinkAriaLabel")}
                className="flex items-center space-x-2"
              >
                <span className="sr-only">{t("logoLinkText")}</span>
                <Logo className="max-sm:rtl:-mr-5" />
              </Link>

              <div className="hidden lg:block">
                <NavLinks className="flex gap-8 text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LocaleSwitcher />

              <ThemeToggler />

              {isPending ? (
                <Loader2 className="animate-spin size-4 text-foreground" />
              ) : authenticated ? (
                <UserAsIcon links={menuLinks} />
              ) : (
                <div className="hidden lg:block">
                  <AuthButtons />
                </div>
              )}

              <MobileSheet>
                <NavLinks className="flex flex-col gap-4 p-4 pt-0 font-medium" />
                <SheetFooter>
                  {authenticated ? <UserAsIcon asModal /> : <AuthButtons />}
                </SheetFooter>
              </MobileSheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
