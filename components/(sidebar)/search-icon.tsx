"use client";

import { useTranslations } from "next-intl";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { Search } from "lucide-react";

export default function SearchIcon() {
  const t = useTranslations("Sidebar.searchIcon");
  const { setOpen } = useSidebar();

  return (
    <SidebarMenuButton
      className="group-data-[collapsible=icon]:block hidden hover:cursor-pointer mt-2 mb-4"
      tooltip={t("tooltipText")}
      aria-label={t("ariaLabel")}
      onClick={() => setOpen(true)}
    >
      <Search className="w-5 h-5" />
      <span className="sr-only">{t("ariaLabel")}</span>
    </SidebarMenuButton>
  );
}
