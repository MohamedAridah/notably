"use client";

import Link from "next/link";
import { createElement } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { LayoutDashboardIcon, Trash2Icon } from "lucide-react";
import { is } from "zod/v4/locales";
import { useTranslations } from "next-intl";

export interface LinkType {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavigationProps {
  navigationLinks?: LinkType[];
}

const defaultLinks: LinkType[] = [
  {
    href: "/dashboard",
    label: "dashboard",
    icon: LayoutDashboardIcon,
  },
  { href: "/dashboard/trash", label: "trash", icon: Trash2Icon },
];

export default function SidebarNavigation({
  navigationLinks = defaultLinks,
}: SidebarNavigationProps) {
  const t = useTranslations("Sidebar.navigation");
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("label")}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationLinks.map((link) => (
            <SidebarMenuItem
              key={link.href}
              onClick={() => {
                if (!isMobile) return;
                setOpenMobile(false);
              }}
            >
              <SidebarMenuButton
                asChild
                tooltip={t(link.label)}
                onClick={() => {
                  if (!isMobile) return;
                  setOpenMobile(false);
                }}
              >
                <Link href={link.href}>
                  {createElement(link.icon, { className: "size-4" })}
                  {t(link.label)}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
