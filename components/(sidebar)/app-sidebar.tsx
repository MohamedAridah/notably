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
import { SearchForm } from "./search-form";
import SidebarSkeleton from "./sidebar-skeleton";
import SidebarData from "./sidebar-data";
import SearchIcon from "./search-icon";
import { HomeIcon } from "lucide-react";

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
          title: note.title,
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
            <Link href="/" aria-label="notably logo. click to go to homepage.">
              <span className="sr-only">Go to Home Page</span>
              <Logo />
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SearchIcon />
          </SidebarMenuItem>

          <div className="group-data-[collapsible=icon]:hidden block">
            <Suspense fallback={<SidebarSkeleton length={1} />}>
              <SearchForm />
            </Suspense>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
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
