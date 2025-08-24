"use client";

import Link from "next/link";
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
import EditNotebookDialog from "@/components/(notebooks)/edit-notebook-button";
import NoteOptions from "./note-options";
import CreateNoteDialog from "../(notes)/create-note-button";

type SidebarDataProps = {
  data: {
    navMain: {
      id: string;
      title: string;
      url: string;
      items: { id: string; title: string; notebook_url: string; url: string }[];
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
            <div className="flex">
              <Link
                href={`/dashboard/notebook/${notebook.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                <FolderClosed className="size-4" />
                {notebook.title}
              </Link>

              <div
                className="ml-auto flex items-center gap-0"
                onClick={(e) => e.stopPropagation()}
              >
                <CreateNoteDialog
                  notebookId={notebook.id}
                  asIcon
                  asIconHidden
                />
                <EditNotebookDialog
                  notebook={{
                    name: notebook.title,
                  }}
                  notebookId={notebook.id}
                  asIcon
                  asIconHidden
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
                        {note.title}
                      </Link>

                      <NoteOptions
                        note={{
                          notebookId: notebook.id,
                          noteId: note.id,
                          noteTitle: note.title,
                          note_url: note.url,
                          notebook_url: note.notebook_url,
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
