import * as React from "react";
import { getNotebooks } from "@/server/notebooks";
import { Logo } from "@/components/utils/logo";
import { SearchForm } from "@/components/search-form";
import SidebarData from "@/components/sidebar-data";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const notebooks = await getNotebooks();
  const data = {
    navMain:
      notebooks.notebooks?.map((notebook) => ({
        id: notebook.id,
        title: notebook.name,
        url: `/dashboard/notebook/${notebook.id}`,
        items: notebook.notes.map((note) => ({
          id: note.id,
          title: note.title,
          url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
        })),
      })) ?? [],
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className="justify-sel">
          <Logo />
        </Link>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarData data={data} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
