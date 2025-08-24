import Logout from "@/components/logout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggler from "@/components/utils/theme-toggler";
import MobileSheet from "@/components/utils/mobile-sheet";
import { UserAsIcon } from "./user";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <section className="flex flex-col gap-4">
      <header className="border-b">
        <div className="flex items-center justify-between w-full p-3 pr-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggler />
            <UserAsIcon />

            <div className="hidden lg:block">
              <Logout />
            </div>

            <MobileSheet>
              <Logout />
            </MobileSheet>
          </div>
        </div>
      </header>

      <section className="flex flex-1 flex-col gap-4 p-5 pt-0">
        {children}
      </section>
    </section>
  );
}
