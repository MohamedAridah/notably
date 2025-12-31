import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import AddNoteIcon from "@/components/(sidebar)/add-note-icon";
import AddNotebookIcon from "@/components/(sidebar)/add-notebook-icon";
import { useTranslations } from "next-intl";

export default function SidebarQuickActions() {
  const t = useTranslations("Sidebar.quickActions");
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("label")}</SidebarGroupLabel>
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
  );
}
