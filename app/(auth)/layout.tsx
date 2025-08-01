import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-dvh flex flex-col justify-center align-center p-6 md:p-10">
      <Link
        href="/"
        className="absolute top-5 left-4 text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        <ChevronLeft className="size-5" /> Home
      </Link>
      {children}
    </section>
  );
}
