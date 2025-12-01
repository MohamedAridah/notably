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
import { NoteScoped } from "../../app/dashboard/notebook/[notebookId]/_components/notebook-notes";
import { setNoteFavoriteAction } from "@/server/notes";
import { NoteCardMode, NoteModePolicies } from "./note-mode-policies";
const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});

const DetailsView = ({
  notes,
  mode = "default",
}: {
  notes: NoteScoped[];
  mode?: NoteCardMode;
}) => {
  const policy = NoteModePolicies[mode];

  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-6/12">Note Name</TableHead>
          {mode === "default" && (
            <TableHead className="w-4/12">Created</TableHead>
          )}
          {mode === "trash" && (
            <TableHead className="w-4/12">Deleted</TableHead>
          )}
          <TableHead className="text-right w-auto"></TableHead>
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
                <span>{note.title}</span>
              )}
            </TableCell>

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
