import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SocialLinks from "./social-links";

interface MobileSheetProps {
  children: React.ReactNode;
  state?: boolean;
}

export default function MobileSheet({
  children,
  state: menuState,
}: MobileSheetProps) {
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
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        </SheetHeader>
        {children}
        <SocialLinks className="p-4 pt-0 flex justify-center items-center flex-wrap gap-6" />
      </SheetContent>
    </Sheet>
  );
}
