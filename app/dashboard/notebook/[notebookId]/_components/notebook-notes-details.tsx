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
import { Note } from "@prisma/client";
import FavoriteButton from "@/components/utils/favorite-button";
import { handleToggleFavorite_Note } from "@/lib/utils";
const NoteOptions = dynamic(() => import("@/components/(notes)/note-options"), {
  ssr: false,
});

const DetailsView = ({ notes }: { notes: Note[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Note Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note) => (
          <TableRow key={note.id}>
            <TableCell className="font-medium flex items-center gap-1.5">
              <FavoriteButton
                isFavorite={note.isFavorite}
                id={note.id}
                onToggle={handleToggleFavorite_Note}
                iconStyles="size-3.5"
              />
              <Link
                href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
                className="hover:underline"
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
