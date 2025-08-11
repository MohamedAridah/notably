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
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import {
  ChevronRight,
  FolderClosed,
  InfoIcon,
  NotebookText,
} from "lucide-react";
import EditNotebookDialog from "./(notebooks)/edit-notebook-button";
import EditNoteDialog from "./(notes)/edit-note-button";

type SidebarDataProps = {
  data: {
    navMain: {
      id: string;
      title: string;
      url: string;
      items: { id: string; title: string; url: string }[];
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

  return (
    <>
      {filteredData.map((item) => (
        <Collapsible
          key={item.id}
          title={item.title}
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
                    href={`/dashboard/notebook/${item.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <FolderClosed className="size-4" />
                    {item.title}
                  </Link>

                  <div
                    className="ml-auto flex items-center gap-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CreateNoteDialog notebookId={item.id} asIcon iconHidden />
                    <EditNotebookDialog
                      notebook={{
                        name: item.title,
                      }}
                      notebookId={item.id}
                      asIcon
                      iconHidden
                    />
                  </div>

                  {item.items.length > 0 && (
                    <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="pl-3">
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild className="group/note-buttons">
                        <div className="flex items-center">
                          <Link
                            href={item.url}
                            className="flex items-center gap-2 flex-1"
                          >
                            <NotebookText className="size-4" />
                            {item.title}
                          </Link>

                          <div className="flex items-center">
                            <CreateNoteDialog
                              notebookId={item.id}
                              asIcon
                              iconHidden
                            />
                            <EditNoteDialog
                              noteId={item.id}
                              note={{ title: item.title }}
                              asIcon
                              iconHidden
                            />

                            <DeleteNoteDialog
                              noteId={item.id}
                              asIcon
                              iconHidden
                            />
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  );
}
