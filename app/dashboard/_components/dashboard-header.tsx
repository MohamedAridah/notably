import Logout from "@/components/logout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserAsIcon } from "@/components/user";
import MobileSheet from "@/components/utils/mobile-sheet";
import ThemeToggler from "@/components/utils/theme-toggler";
import { HomeIcon } from "lucide-react";


export default function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between w-full p-3 pr-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggler />
          <UserAsIcon
            links={[{ href: "/", label: "Home", icon: <HomeIcon /> }]}
          />

          <MobileSheet>
            <Logout />
          </MobileSheet>
        </div>
      </div>
    </header>
  );
}
