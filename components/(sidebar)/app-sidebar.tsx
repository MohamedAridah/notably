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
import { Logo, LogoIcon } from "@/components/utils/logo";
import { Search } from "@/components/utils/search";
import SidebarData from "@/components/(sidebar)/sidebar-data";
import SearchIcon from "@/components/(sidebar)/search-icon";
import SidebarSkeleton from "@/components/(sidebar)/sidebar-skeleton";
import SidebarNavigation from "@/components/(sidebar)/sidebar-navigation";
import SidebarQuickActions from "@/components/(sidebar)/sidebar-quick-actions";
import { HomeIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { isLocaleRtl } from "@/i18n/routing";

export async function AppSidebar() {
  const notebooks = await getCachedNotebooksAction();
  const t = await getTranslations("Sidebar");
  const locale = await getLocale();
  const isRtl = isLocaleRtl(locale);

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
    <Sidebar collapsible="icon" side={isRtl ? "right" : "left"}>
      <SidebarHeader>
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem className="overflow-x-hidden group-data-[collapsible=icon]:-ms-1">
            <Link
              href="/"
              className="w-fit block"
              aria-label={t("logoLinkText")}
            >
              <span className="sr-only">{t("logoLinkText")}</span>
              <Logo className="group-data-[collapsible=icon]:h-0! rtl:-mr-6" />

              {isRtl && (
                <LogoIcon className="group-data-[collapsible=icon]:block hidden" />
              )}
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SearchIcon />
          </SidebarMenuItem>

          <Suspense fallback={<SidebarSkeleton length={1} />}>
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden block mt-2 mb-4">
              <Search placeholder={t("searchForm.placeholder")} />
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
          links={[{ href: "/", label: "home", icon: <HomeIcon /> }]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
