import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Logo } from "@/components/utils/logo";
import ThemeToggler from "@/components/utils/theme-toggler";
import LocaleSwitcher from "@/components/utils/locale-switcher";
import { useTranslations } from "next-intl";

const AuthHeader = () => {
  const t = useTranslations("AuthHeader");
  return (
    <header>
      <nav className={cn("w-full border-b backdrop-blur-3xl")}>
        <div className="mx-auto max-w-5xl px-4 transition-all duration-300">
          <div className="relative flex items-center justify-between gap-6 py-3 lg:gap-0 ">
            <Link
              href="/"
              className="flex items-center rtl:flex-row-reverse gap-0.5 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeftIcon className="size-5" /> {t("home")}
            </Link>
            <Logo className="h-[30px]" />
            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <ThemeToggler />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default AuthHeader;
