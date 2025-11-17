import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCachedNotebooks } from "@/server/notebooks";
import { UserForNav } from "../user";
import Link from "next/link";
import { Logo } from "../utils/logo";
import { Suspense } from "react";
import { Search } from "./search";
import SidebarSkeleton from "./sidebar-skeleton";
import SidebarData from "./sidebar-data";
import SearchIcon from "./search-icon";
import { HomeIcon } from "lucide-react";
import CreateNoteDialog from "../(notes)/create-note-button";
import AddNoteIcon from "./add-note-icon";

export async function AppSidebar() {
  const notebooks = await getCachedNotebooks();

  const data = {
    navMain:
      notebooks.notebooks?.map((notebook) => ({
        id: notebook.id,
        title: notebook.name,
        url: `/dashboard/notebook/${notebook.id}`,
        isFavorite: notebook.isFavorite,
        isDefault: notebook.isDefault,
        items: notebook.notes.map((note) => ({
          id: note.id,
          title: note.title || "Untitled Note",
          notebook_url: `/dashboard/notebook/${notebook.id}`,
          url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
          isFavorite: note.isFavorite,
        })),
      })) ?? [],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem className="overflow-x-hidden group-data-[collapsible=icon]:-ml-1">
            <Link
              href="/"
              className="w-fit block"
              aria-label="notably logo. click to go to homepage."
            >
              <span className="sr-only">Go to Home Page</span>
              <Logo />
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SearchIcon />
          </SidebarMenuItem>

          <Suspense fallback={<SidebarSkeleton length={1} />}>
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden block">
              <Search placeholder="Search your notes..." />
            </SidebarMenuItem>
          </Suspense>

          <SidebarMenuItem>
            <CreateNoteDialog
              variant="secondary"
              size="sm"
              className="w-full mt-1 group-data-[collapsible=icon]:hidden"
            />
            <AddNoteIcon />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <Suspense fallback={<SidebarSkeleton length={5} showIcon />}>
          <SidebarData data={data} />
        </Suspense>
      </SidebarContent>

      <SidebarFooter>
        <UserForNav
          links={[{ href: "/", label: "Home", icon: <HomeIcon /> }]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
