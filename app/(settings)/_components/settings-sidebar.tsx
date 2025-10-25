import Link from "next/link";
import { KeyIcon, ShieldIcon, Trash2Icon, UserIcon } from "lucide-react";

const LINKS = [
  {
    name: "Public Profile",
    href: "/settings/profile",
    icon: UserIcon,
  },
  {
    name: "Security",
    href: "/settings/security",
    icon: ShieldIcon,
  },
  {
    name: "Sessions",
    href: "/settings/sessions",
    icon: KeyIcon,
  },
];

export default function SettingsSidebar() {
  return (
    <nav className="sm:flex-2/12 w-full">
      <ul className="space-y-2">
        {LINKS.map((link) => (
          <li
            key={link.name}
            className="flex items-center gap-1.5 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring hover:bg-input/30 text-muted-foreground rounded-md px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-[color] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 flex-1 max-sm:justify-centerhover:cursor-pointer "
          >
            <link.icon />
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
