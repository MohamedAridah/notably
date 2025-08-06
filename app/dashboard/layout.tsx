import { AppSidebar } from "@/components/app-sidebar";
import PageWrapper from "@/components/page-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

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
