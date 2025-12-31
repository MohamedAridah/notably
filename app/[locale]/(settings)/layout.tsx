import { HeroHeader } from "@/components/header";
import Footer from "@/components/footer";
import SettingsSidebar from "./_components/settings-sidebar";

export const metadata = {
  title: {
    default: "Account Settings",
    template: "Account Settings | %s",
  },
  description:
    "Manage your Notably account settings including profile information, security preferences, and application configurations to tailor your experience.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroHeader className="static" />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
        <SettingsSidebar />
        <section className="sm:flex-9/12 w-full">{children}</section>
      </main>
      <Footer />
    </>
  );
}
