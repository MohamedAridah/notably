import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/utils/logo";
import NavLinks from "@/components/utils/nav-links";
import SocialLinks from "@/components/utils/social-links";
import { useTranslations } from "next-intl";

export default function Footer({ ...props }: React.ComponentProps<"footer">) {
  const t = useTranslations("Footer");
  return (
    <footer className={cn("py-10 md:py-15", props.className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/"
          aria-label={t("logoLinkAriaLabel")}
          className="mx-auto block size-fit"
        >
          <Logo />
        </Link>

        <NavLinks className="my-8 flex flex-wrap justify-center gap-6 text-sm" />

        <SocialLinks className="my-8 flex flex-wrap justify-center gap-6 text-sm" />

        <span className="text-muted-foreground block text-center text-sm">
          {t("copyrights")}
        </span>
      </div>
    </footer>
  );
}
