import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import { ExternalLinkIcon } from "lucide-react";
import EditNoteDialog from "./edit-note-button";
import FavoriteButton from "../utils/favorite-button";
import { handleToggleFavorite_Note } from "@/lib/utils";
import { NoteScoped } from "@/app/dashboard/notebook/[notebookId]/_components/notebook-notes";

export default function NoteCard({ note }: { note: NoteScoped }) {
  const noteURL = `/dashboard/notebook/${note.notebookId}/note/${note.id}`;
  return (
    <Card className="shadow-xs hover:shadow-sm transition-shadow ease-in-out duration-150">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group/note-buttons">
          <div className="flex items-center gap-1.5">
            <FavoriteButton
              isFavorite={note.isFavorite}
              id={note.id}
              onToggle={handleToggleFavorite_Note}
            />

            <Link href={noteURL} className="hover:underline underline-offset-3">
              {note.title || "Untitled Note"}
            </Link>
          </div>

          <EditNoteDialog
            note={note}
            noteId={note.id}
            trigger={{ asIcon: true, asIconHidden: true }}
          />
        </CardTitle>
        <CardDescription>Click view to see note content.</CardDescription>
      </CardHeader>
      <CardFooter className="ml-auto gap-2">
        <Link
          href={noteURL}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLinkIcon /> View
        </Link>
        <DeleteNoteDialog noteId={note.id} />
      </CardFooter>
    </Card>
  );
}
