import Link from "next/link";
import { Logo } from "@/components/utils/logo";
import NavLinks, { menuItems } from "@/components/utils/nav-links";
import SocialLinks from "./utils/social-links";
import { cn } from "@/lib/utils";

export default function Footer({ ...props }: React.ComponentProps<"footer">) {
  return (
    <footer className={cn("py-10 md:py-15", props.className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <NavLinks className="my-8 flex flex-wrap justify-center gap-6 text-sm" />

        <SocialLinks className="my-8 flex flex-wrap justify-center gap-6 text-sm" />

        <span className="text-muted-foreground block text-center text-sm">
          © 2025 Notably, All rights reserved
        </span>
      </div>
    </footer>
  );
}
