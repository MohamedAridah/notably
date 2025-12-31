import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function CtaButton({
  text,
  ...props
}: React.ComponentProps<typeof Button> & { text?: string }) {
  const t = useTranslations("HomePage.HeroSection");
  return (
    <Button asChild size="lg" className={props.className} {...props}>
      <Link href="/dashboard">
        <span className="text-nowrap">{text || t("buttonText")}</span>
      </Link>
    </Button>
  );
}
