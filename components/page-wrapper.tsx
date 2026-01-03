import DashboardHeader from "@/app/[locale]/dashboard/_components/dashboard-header";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <section className="flex flex-col flex-1 w-full gap-4">
      <DashboardHeader />

      <section className="flex flex-col flex-1 w-full gap-4 pb-5 [&_>*]:px-5">
        {children}
      </section>
    </section>
  );
}
