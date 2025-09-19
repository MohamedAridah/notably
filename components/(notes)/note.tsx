import Link from "next/link";
import { type Note } from "@prisma/client";
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

export default function NoteCard({ note }: { note: Note }) {
  return (
    <Card className="shadow-xs hover:shadow-sm transition-shadow ease-in-out duration-150">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group/note-buttons">
          <div className="div flex items-center gap-1">
            <FavoriteButton
              isFavorite={note.isFavorite}
              id={note.id}
              onToggle={handleToggleFavorite_Note}
            />
          </div>
          {note.title}
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
          href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLinkIcon /> View
        </Link>
        <DeleteNoteDialog noteId={note.id} />
      </CardFooter>
    </Card>
  );
}
