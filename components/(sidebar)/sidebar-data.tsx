"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  FolderClosed,
  InfoIcon,
  NotebookText,
} from "lucide-react";
import FavoriteButton from "../utils/favorite-button";
import {
  handleToggleFavorite_Note,
  handleToggleFavorite_Notebook,
} from "@/lib/utils";
const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});
const NotebookOptions = dynamic(
  () => import("@/components/(notebooks)/notebook-options"),
  { ssr: false }
);

type SidebarDataProps = {
  data: {
    navMain: {
      id: string;
      title: string;
      url: string;
      isFavorite: boolean;
      items: {
        id: string;
        title: string;
        notebook_url: string;
        url: string;
        isFavorite: boolean;
      }[];
    }[];
  };
};

export default function SidebarData({ data }: SidebarDataProps) {
  const [search] = useQueryState("search", { defaultValue: "" });
  const filteredData = data.navMain.filter((item) => {
    const notebookMatches = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const noteMatches = item.items.some((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
    );

    return notebookMatches || noteMatches;
  });

  if (filteredData.length === 0 && search) {
    return (
      <p className="flex items-center gap-2 px-4 mt-2 text-sm">
        <InfoIcon className="size-4" /> No results found
      </p>
    );
  }

  return filteredData.map((notebook) => (
    <Collapsible
      key={notebook.id}
      title={notebook.title}
      defaultOpen
      className="group/collapsible"
    >
      <SidebarGroup className="py-1">
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
        >
          <CollapsibleTrigger asChild className="group/notebook-buttons">
            <div className="flex gap-2">
              <Link
                href={`/dashboard/notebook/${notebook.id}`}
                className="flex items-center gap-2 hover:underline flex-1"
              >
                <FolderClosed className="size-4" />
                <p className="overflow-hidden text-ellipsis whitespace-nowrap w-[131px]">
                  {notebook.title}
                </p>
              </Link>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <FavoriteButton
                  isFavorite={notebook.isFavorite}
                  id={notebook.id}
                  onToggle={handleToggleFavorite_Notebook}
                  iconStyles="size-3.5"
                />

                <NotebookOptions
                  notebook={{
                    id: notebook.id,
                    name: notebook.title,
                    isFavorite: notebook.isFavorite,
                  }}
                  // className="flex items-center sm:opacity-0 group-hover/notebook-buttons:opacity-100"
                  className="flex items-center"
                />
              </div>

              {notebook.items.length > 0 && (
                <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
              )}
            </div>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="pl-3">
              {notebook.items.map((note) => (
                <SidebarMenuItem key={note.title}>
                  <SidebarMenuButton asChild className="group/note-buttons">
                    <div className="flex items-center gap-2">
                      <Link
                        href={note.url}
                        className="flex items-center gap-2 flex-1"
                      >
                        <NotebookText className="size-4" />
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap w-[145px]">
                          {note.title}
                        </p>
                      </Link>

                      <FavoriteButton
                        isFavorite={note.isFavorite}
                        id={note.id}
                        onToggle={handleToggleFavorite_Note}
                        iconStyles="size-3.5"
                      />

                      <NoteOptions
                        note={{
                          notebookId: notebook.id,
                          noteId: note.id,
                          noteTitle: note.title,
                          note_url: note.url,
                          notebook_url: note.notebook_url,
                          isFavorite: note.isFavorite,
                        }}
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  ));
}
