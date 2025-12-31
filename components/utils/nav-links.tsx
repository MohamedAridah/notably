import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface NavLink {
  name: string;
  path: string;
}

const menuItems: NavLink[] = [{ name: "features", path: "#features" }];

export default function NavLinks({ ...props }: React.ComponentProps<"ul">) {
  const t = useTranslations("NavLinks");
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <ul className={props.className}>
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.path}
            className="text-muted-foreground hover:text-accent-foreground block duration-150 capitalize"
          >
            <span>{t(item.name)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
