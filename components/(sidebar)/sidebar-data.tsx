"use client";

import { useState } from "react";
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  FolderClosedIcon,
  FolderIcon,
  InfoIcon,
  NotebookTextIcon,
} from "lucide-react";

const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});
const NotebookOptions = dynamic(
  () => import("@/components/(notebooks)/notebook-options"),
  { ssr: false }
);

export type NotebookLink = {
  id: string;
  title: string;
  url: string;
  isDefault: boolean;
  isFavorite: boolean;
  items: NoteLink[];
};

export type NoteLink = {
  id: string;
  title: string;
  notebook_url: string;
  url: string;
  isFavorite: boolean;
};

type SidebarDataProps = {
  data: {
    navMain: NotebookLink[];
  };
};

export default function SidebarData({ data }: SidebarDataProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const [active, setActive] = useState<{
    [key: string]: number | boolean | string;
  }>({
    main: false,
    sub: "",
  });

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

  const handleActiveMenuButton = (cb: {
    [key: string]: number | boolean | string;
  }) => {
    setActive((prev) => ({ ...prev, ...cb }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredData.map((notebook, notebookIndex) => (
            <Collapsible
              className="group/collapsible"
              defaultOpen
              key={notebook.id}
            >
              <SidebarMenuItem key={notebook.id}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={notebook.title}
                    isActive={active.main === notebookIndex || false}
                    asChild
                  >
                    <div className="flex">
                      <Link
                        href={notebook.url}
                        onClick={(e) => {
                          handleActiveMenuButton({ main: notebookIndex });
                          if (!isMobile) return;
                          setOpenMobile(false);
                        }}
                        className="flex items-center gap-2 flex-1 hover:underline underline-offset-3"
                      >
                        <FolderClosedIcon className="size-4" />
                        <span
                          className="inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[131px]"
                          title={notebook.title}
                        >
                          {notebook.title}
                        </span>
                      </Link>

                      {!notebook.isDefault && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2"
                        >
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
                      )}

                      {notebook.items.length > 0 && (
                        <ChevronRight className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {notebook.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub className="pr-0 mr-0">
                      {notebook.items.map((note, noteIndex) => (
                        <SidebarMenuSubItem key={note.id}>
                          <SidebarMenuSubButton
                            isActive={
                              active.sub === `${notebookIndex}-${noteIndex}` ||
                              false
                            }
                            asChild
                          >
                            <div className="flex items-center">
                              <Link
                                href={note.url}
                                className="flex items-center gap-2 flex-1 hover:underline underline-offset-3"
                                onClick={() => {
                                  handleActiveMenuButton({
                                    main: notebookIndex,
                                    sub: `${notebookIndex}-${noteIndex}`,
                                  });
                                  if (!isMobile) return;
                                  setOpenMobile(false);
                                }}
                              >
                                <NotebookTextIcon className="size-4" />
                                <span
                                  className="inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[143px]"
                                  title={note.title}
                                >
                                  {note.title}
                                </span>
                              </Link>
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
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
