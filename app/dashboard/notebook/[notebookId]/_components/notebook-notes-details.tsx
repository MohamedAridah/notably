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
import { NoteScoped } from "./notebook-notes";
import { setNoteFavorite } from "@/server/notes";
const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});

const DetailsView = ({ notes }: { notes: NoteScoped[] }) => {
  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-6/12">Note Name</TableHead>
          <TableHead className="w-4/12">Date</TableHead>
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
              <FavoriteButton
                isFavorite={note.isFavorite}
                id={note.id}
                onToggle={setNoteFavorite}
                iconStyles="size-3.5"
              />
              <Link
                href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
                className="truncate pr-3 hover:underline"
              >
                {note.title || "Untitled Note"}
              </Link>
            </TableCell>
            <TableCell>{new Date(note.createdAt).toDateString()}</TableCell>
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
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DetailsView;
