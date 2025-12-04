import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import dynamic from "next/dynamic";
import FavoriteButton from "@/components/utils/favorite-button";
import { NoteScoped } from "@/app/dashboard/notebook/[notebookId]/_components/notebook-notes";
import { setNoteFavoriteAction } from "@/server/notes";
import { NoteCardMode, NoteModePolicies } from "./note-mode-policies";
const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});

export type NoteScopedWithNotebookName = NoteScoped & {
  notebook?: { name: string };
};

const DetailsView = ({
  notes,
  mode = "default",
}: {
  notes: NoteScopedWithNotebookName[];
  mode?: NoteCardMode;
}) => {
  const policy = NoteModePolicies[mode];
  const isTrashMode = mode === "trash";

  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className={`${isTrashMode ? "w-5/12" : "w-6/12"}`}>
            Note Name
          </TableHead>
          {mode === "default" && (
            <TableHead className="w-4/12">Created</TableHead>
          )}
          {isTrashMode && <TableHead className="w-3/12">Notebook</TableHead>}
          {isTrashMode && <TableHead className="w-3/12">Deleted</TableHead>}
          <TableHead className="text-right w-1/12 max-sm:w-3/12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note) => (
          <TableRow key={note.id}>
            <TableCell
              className="font-medium flex items-center gap-1.5"
              title={note.title || "Untitled Note"}
            >
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
                  className="truncate pr-3 hover:underline"
                >
                  {note.title || "Untitled Note"}
                </Link>
              ) : (
                <span className="truncate pr-3">
                  {note.title || "Untitled Note"}
                </span>
              )}
            </TableCell>

            {note.deletedAt && (
              <TableCell className="truncate pr-3">
                <Link
                  href={`/dashboard/notebook/${note.notebookId}`}
                  className="hover:underline"
                  title={note.notebook?.name}
                >
                  {note.notebook?.name}
                </Link>
              </TableCell>
            )}

            {!note.deletedAt && (
              <TableCell>{new Date(note.createdAt).toDateString()}</TableCell>
            )}

            {note.deletedAt && (
              <TableCell>{new Date(note.deletedAt).toDateString()}</TableCell>
            )}

            <TableCell className="text-right">
              <NoteOptions
                note={{
                  note_url: `/dashboard/notebook/${note.notebookId}/note/${note.id}`,
                  notebook_url: `/dashboard/notebook/${note.notebookId}`,
                  notebookId: note.notebookId as string,
                  noteId: note.id,
                  noteTitle: note.title,
                }}
                alignStart
                mode={mode}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DetailsView;
