import { Suspense } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCachedNotebooksAction } from "@/server/notebooks";
import { UserForNav } from "@/components/user";
import { Logo } from "@/components/utils/logo";
import { Search } from "@/components/utils/search";
import SidebarData from "@/components/(sidebar)/sidebar-data";
import SearchIcon from "@/components/(sidebar)/search-icon";
import AddNoteIcon from "@/components/(sidebar)/add-note-icon";
import AddNotebookIcon from "@/components/(sidebar)/add-notebook-icon";
import SidebarSkeleton from "@/components/(sidebar)/sidebar-skeleton";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import { HomeIcon, LayoutDashboardIcon, Trash2Icon } from "lucide-react";

export async function AppSidebar() {
  const notebooks = await getCachedNotebooksAction();

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
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden block mt-2 mb-4">
              <Search placeholder="Search your notes..." />
            </SidebarMenuItem>
          </Suspense>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <CreateNoteDialog
                  variant="ghost"
                  size="sm"
                  className="w-full group-data-[collapsible=icon]:hidden justify-start"
                />
                <AddNoteIcon />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <CreateNotebookDialog
                  variant="ghost"
                  size="sm"
                  className="w-full group-data-[collapsible=icon]:hidden justify-start"
                />
                <AddNotebookIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/dashboard">
                    <LayoutDashboardIcon className="size-4" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Trash">
                  <Link href="/dashboard/trash">
                    <Trash2Icon className="size-4" />
                    Trash
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
