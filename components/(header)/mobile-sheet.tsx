import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AuthButtons from "@/components/utils/auth-buttons";
import NavLinks from "@/components/utils/nav-links";

export default function MobileSheet({ state: menuState }: { state: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
          aria-label={menuState == true ? "Close Menu" : "Open Menu"}
        >
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent>
        <NavLinks className="flex flex-col gap-4 p-4 pt-10 font-medium" />
        <SheetFooter>
          <AuthButtons />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
