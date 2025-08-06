import Link from "next/link";
import { type Note } from "@prisma/client";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";

export default function NoteCard({ note }: { note: Note }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardFooter className="ml-auto gap-2">
        <Link
          href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View
        </Link>
        <DeleteNoteDialog noteId={note.id} />
      </CardFooter>
    </Card>
  );
}
