"use client";

import { useTransition } from "react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/utils/loading-swap";
import { LanguagesIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
  dir?: "ltr" | "rtl";
  withLabel?: boolean;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  dir = "ltr",
  withLabel = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleSwitchLocale(newLocale: string) {
    startTransition(() => {
      if (newLocale !== locale) {
        router.replace(pathname, { locale: newLocale });
        router.refresh();
      }
    });
  }

  return (
    <DropdownMenu modal={false} dir={dir}>
      <DropdownMenuTrigger
        aria-label={label}
        className={clsx(isPending && "pointer-events-none opacity-60")}
        asChild
      >
        <Button
          variant={withLabel ? "outline" : "ghost"}
          size={withLabel ? "sm" : "icon"}
          type="button"
          className="place-self-end"
        >
          <LoadingSwap isLoading={isPending}>
            <LanguagesIcon /> {withLabel ? label : null}
            <span className="sr-only">Change Language</span>
          </LoadingSwap>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={defaultValue}
          onValueChange={handleSwitchLocale}
        >
          {items.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
