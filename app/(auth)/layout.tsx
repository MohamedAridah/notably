import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ThemeToggler from "@/components/utils/theme-toggler";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-dvh flex flex-col justify-center align-center p-6 md:p-10">
      <Link
        href="/"
        className="absolute top-6 left-5 text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        <ChevronLeft className="size-5" /> Home
      </Link>
      <div className="w-full max-w-md mx-auto my-10">{children}</div>
      <div className="absolute bottom-5 right-5">
        <ThemeToggler />
      </div>
    </section>
  );
}
