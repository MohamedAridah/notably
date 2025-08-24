import { Suspense } from "react";
import { getNotebooks } from "@/server/notebooks";
import { Logo } from "@/components/utils/logo";
import { SearchForm } from "@/components/(sidebar)/search-form";
import SidebarData from "@/components/(sidebar)/sidebar-data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SidebarSkeleton from "./sidebar-skeleton";
import { UserForNav } from "@/components/user";

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
          notebook_url: `/dashboard/notebook/${notebook.id}`,
          url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
        })),
      })) ?? [],
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/" aria-label="notably logo. click to go to homepage.">
          <span className="sr-only">Go to homepage</span>
          <Logo />
        </Link>
        <Suspense fallback={<SidebarSkeleton length={1} />}>
          <SearchForm />
        </Suspense>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <Suspense fallback={<SidebarSkeleton length={3} showIcon />}>
          <SidebarData data={data} />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <UserForNav />
      </SidebarFooter>
    </Sidebar>
  );
}
