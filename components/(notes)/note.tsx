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

export default function NoteCard({ note }: { note: Note }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group/note-buttons">
          {note.title}
          <EditNoteDialog note={note} noteId={note.id} asIcon asIconHidden />
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
