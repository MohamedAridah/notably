import { AppSidebar } from "@/components/(sidebar)/app-sidebar";
import PageWrapper from "@/components/page-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard - Notabky . Think Better",
    template: "%s - Notabky . Think Better",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <PageWrapper>{children}</PageWrapper>
      </main>
    </SidebarProvider>
  );
}
