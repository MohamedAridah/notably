import Footer from "@/components/footer";
import { HeroHeader } from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroHeader className="static" />
      <main className="max-w-5xl mx-auto p-6 pb-4">{children}</main>
      <Footer />
    </>
  );
}
