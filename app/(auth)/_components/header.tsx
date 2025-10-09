import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Logo } from "@/components/utils/logo";
import ThemeToggler from "@/components/utils/theme-toggler";

const AuthHeader = () => {
  return (
    <header>
      <nav className={cn("w-full border-b backdrop-blur-3xl")}>
        <div className="mx-auto max-w-5xl px-4 transition-all duration-300">
          <div className="relative flex items-center justify-between gap-6 py-3 lg:gap-0 ">
            <Link
              href="/"
              className="flex items-center gap-0.5 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeftIcon className="size-5" /> Home
            </Link>
            <Logo className="h-[30px]" />
            <ThemeToggler />
          </div>
        </div>
      </nav>
    </header>
  );
};
export default AuthHeader;
