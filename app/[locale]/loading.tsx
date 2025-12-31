import { Logo } from "@/components/utils/logo";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center gap-1">
        <Logo />
        <Loader2 className="size-6 animate-spin text-[#9B99FE]" />
      </div>
    </section>
  );
}
