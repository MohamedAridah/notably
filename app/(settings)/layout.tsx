import { HeroHeader } from "@/components/header";
import Footer from "@/components/footer";
import SettingsSidebar from "./_components/settings-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Account Settings",
    template: "Account Settings | %s",
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroHeader className="static" />
      <main className="max-w-5xl mx-auto p-6 pb-4 flex flex-col sm:flex-row gap-3">
        <SettingsSidebar />
        <section className="sm:flex-9/12 w-full">{children}</section>
      </main>
      <Footer />
    </>
  );
}
