import DashboardHeader from "@/app/dashboard/_components/dashboard-header";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <section className="flex flex-col flex-1 w-full gap-4">
      <DashboardHeader />

      <section className="flex flex-col flex-1 w-full gap-4 p-5 pt-0">
        {children}
      </section>
    </section>
  );
}
