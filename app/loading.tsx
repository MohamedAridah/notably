import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex items-center justify-center w-full h-screen">
      <Loader2 className="size-5 animate-spin" />
    </section>
  );
}
