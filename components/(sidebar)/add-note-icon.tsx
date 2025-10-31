"use client";

import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { PlusIcon } from "lucide-react";

export default function AddNoteIcon() {
  const { setOpen } = useSidebar();

  return (
    <SidebarMenuButton
      className="group-data-[collapsible=icon]:block hidden hover:cursor-pointer"
      tooltip={"Create Note"}
      onClick={() => setOpen(true)}
    >
      <PlusIcon className="w-5 h-5" />
    </SidebarMenuButton>
  );
}
