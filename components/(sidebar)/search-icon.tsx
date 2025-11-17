"use client";

import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { Search } from "lucide-react";

export default function SearchIcon() {
  const { setOpen } = useSidebar();

  return (
    <SidebarMenuButton
      className="group-data-[collapsible=icon]:block hidden hover:cursor-pointer"
      tooltip={'Search'}
      aria-label="Search for notes and notebooks"
      onClick={() => setOpen(true)}
    >
      <Search className="w-5 h-5" />
      <span className="sr-only">Search for notes and notebooks</span>
    </SidebarMenuButton>
  );
}
