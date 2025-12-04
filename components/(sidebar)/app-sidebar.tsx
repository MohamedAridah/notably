import { Suspense } from "react";
import Link from "next/link";
import { getCachedNotebooksAction } from "@/server/notebooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserForNav } from "@/components/user";
import { Logo } from "@/components/utils/logo";
import { Search } from "@/components/utils/search";
import SidebarData from "@/components/(sidebar)/sidebar-data";
import SearchIcon from "@/components/(sidebar)/search-icon";
import SidebarSkeleton from "@/components/(sidebar)/sidebar-skeleton";
import SidebarNavigation from "@/components/(sidebar)/sidebar-navigation";
import SidebarQuickActions from "@/components/(sidebar)/sidebar-quick-actions";
import { HomeIcon } from "lucide-react";

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
        <SidebarQuickActions />

        <SidebarNavigation />

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
