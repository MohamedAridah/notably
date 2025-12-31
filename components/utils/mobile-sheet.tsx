import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SocialLinks from "@/components/utils/social-links";
import { Menu } from "lucide-react";

interface MobileSheetProps {
  children: React.ReactNode;
}

export default function MobileSheet({ children }: MobileSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        className={`relative z-20 block cursor-pointer lg:hidden `}
        aria-label="Open Menu"
      >
        <Menu />
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
