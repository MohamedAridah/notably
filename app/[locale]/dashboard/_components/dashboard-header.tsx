import Logout from "@/components/logout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserAsIcon } from "@/components/user";
import LocaleSwitcher from "@/components/utils/locale-switcher";
import MobileSheet from "@/components/utils/mobile-sheet";
import ThemeToggler from "@/components/utils/theme-toggler";
import { HomeIcon } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between w-full p-3">
        <SidebarTrigger />

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />

          <ThemeToggler />

          <UserAsIcon
            links={[{ href: "/", label: "home", icon: <HomeIcon /> }]}
          />

          <MobileSheet>
            <Logout />
          </MobileSheet>
        </div>
      </div>
    </header>
  );
}
