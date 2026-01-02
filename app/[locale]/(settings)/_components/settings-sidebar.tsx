import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  HomeIcon,
  KeyIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";

const LINKS = [
  {
    name: "home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    name: "profile",
    href: "/settings/profile",
    icon: UserIcon,
  },
  {
    name: "security",
    href: "/settings/security",
    icon: ShieldIcon,
  },
  {
    name: "sessions",
    href: "/settings/sessions",
    icon: KeyIcon,
  },
];

export default async function SettingsSidebar() {
  const t = await getTranslations("SettingsSidebar");
  return (
    <nav className="sm:flex-2/12 w-full max-sm:mb-5">
      <ul className="space-y-2">
        {LINKS.map((link) => (
          <li
            key={link.name}
            className="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring hover:bg-input/30 text-muted-foreground rounded-md px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-[color] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 flex-1 max-sm:justify-centerhover:cursor-pointer"
          >
            <Link href={link.href} className="flex items-center gap-1.5 ">
              <link.icon />
              {t(link.name)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
