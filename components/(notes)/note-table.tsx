import Link from "next/link";
import dynamic from "next/dynamic";
import { NoteCardDefault, NoteCardTrashed } from "@/types/types";
import { setNoteFavoriteAction } from "@/server/notes";
import { ResponsiveGridTable } from "@/components/utils/responsive-grid-table";
import { NotebookCardMode } from "@/components/(notebooks)/notebook-mode-policies";
import FavoriteButton from "@/components/utils/favorite-button";
import { NoteModePolicies } from "@/components/(notes)/note-mode-policies";
const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});

interface NotebookTableProps {
  notes: (NoteCardDefault & NoteCardTrashed)[];
  mode: NotebookCardMode;
  showHeader?: boolean;
}

export default function NoteTable({
  notes,
  mode,
  showHeader = false,
}: NotebookTableProps) {
  const policy = NoteModePolicies[mode];
  const isTrashMode = mode === "trash";
  const columns = [
    {
      key: "name",
      label: "Note Name",
      className: `${isTrashMode ? "col-span-5 max-md:col-span-4" : "col-span-6"}`,
    },
    ...(isTrashMode
      ? [
          {
            key: "notebook",
            label: "Notebook",
            className: "col-span-3",
          },
        ]
      : []),
    {
      key: "date",
      label: isTrashMode ? "Deleted" : "Created",
      className: `${isTrashMode ? "col-span-3" : "col-span-4"}`,
    },
    {
      key: "options",
      label: "",
      className: `text-right ${isTrashMode ? "col-span-1 max-md:col-span-2" : "col-span-2"}`,
    },
  ];

  return (
    <ResponsiveGridTable
      columns={columns}
      showHeader={showHeader}
      data={notes}
      rowKey={(n) => n.id}
      renderCell={(note, column) => {
        switch (column.key) {
          case "name":
            return (
              <div className="flex items-center gap-1.5 overflow-hidden">
                {policy.canFavorite && (
                  <FavoriteButton
                    isFavorite={note.isFavorite}
                    id={note.id}
                    onToggle={setNoteFavoriteAction}
                    disabled={!policy.favoriteInteractive}
                    iconStyles="size-3.5"
                  />
                )}

                {policy.canView ? (
                  <Link
                    href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
                    className="truncate pr-3 hover:underline underline-offset-3"
                  >
                    {note.title || "Untitled Note"}
                  </Link>
                ) : (
                  <span className="truncate pr-3">
                    {note.title || "Untitled Note"}
                  </span>
                )}
              </div>
            );

          case "notebook":
            return isTrashMode ? (
              <Link
                href={`/dashboard/notebook/${note.notebookId}`}
                className="hover:underline underline-offset-3 truncate pr-3"
                title={note.notebook?.name}
              >
                {note.notebook?.name}
              </Link>
            ) : null;

          case "date":
            return new Date(note.deletedAt ?? note.createdAt).toDateString();

          case "options":
            return (
              <NoteOptions
                note={{
                  note_url: `/dashboard/notebook/${note.notebookId}/note/${note.id}`,
                  notebook_url: `/dashboard/notebook/${note.notebookId}`,
                  notebookId: note.notebookId as string,
                  noteId: note.id,
                  noteTitle: note.title,
                  isFavorite: note.isFavorite,
                }}
                alignStart
                mode={mode}
              />
            );
        }
      }}
    />
  );
}
