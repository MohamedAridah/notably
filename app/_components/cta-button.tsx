import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CtaButton({
  text = "Start Notably",
  ...props
}: React.ComponentProps<typeof Button> & { text?: string }) {
  return (
    <Button asChild size="lg" className={props.className} {...props}>
      <Link href="/dashboard">
        <span className="text-nowrap">{text}</span>
      </Link>
    </Button>
  );
}
