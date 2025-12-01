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
import { NoteScoped } from "@/app/dashboard/notebook/[notebookId]/_components/notebook-notes";
import NoteOptions from "./note-options";
import { setNoteFavoriteAction } from "@/server/notes";
import { NoteCardMode, NoteModePolicies } from "./note-mode-policies";
import RestoreNoteDialog from "./restore-note-button";

export default function NoteCard({
  note,
  mode = "default",
}: {
  note: NoteScoped;
  mode?: NoteCardMode;
}) {
  const policy = NoteModePolicies[mode];
  const notebookURL = `/dashboard/notebook/${note.notebookId}`;
  const noteURL = `/dashboard/notebook/${note.notebookId}/note/${note.id}`;

  return (
    <Card className="shadow-xs hover:shadow-sm transition-shadow ease-in-out duration-150">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 group/note-buttons">
            <div className="flex items-center gap-1.5">
              {policy.canFavorite && (
                <FavoriteButton
                  isFavorite={note.isFavorite}
                  id={note.id}
                  onToggle={setNoteFavoriteAction}
                />
              )}

              {policy.canView ? (
                <Link
                  href={noteURL}
                  className="hover:underline underline-offset-3"
                >
                  {note.title || "Untitled Note"}
                </Link>
              ) : (
                <span>{note.title || "Untitled Note"}</span>
              )}
            </div>

            {policy.canEdit && (
              <EditNoteDialog
                note={note}
                noteId={note.id}
                trigger={{ asIcon: true, asIconHidden: true }}
              />
            )}
          </div>

          {policy.canOptions && (
            <NoteOptions
              note={{
                notebookId: note.notebookId as string,
                noteId: note.id,
                noteTitle: note.title || "Untitled Note",
                note_url: noteURL,
                notebook_url: notebookURL,
                isFavorite: note.isFavorite,
              }}
              alignStart={true}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            />
          )}
        </CardTitle>
        <CardDescription>Click view to see note content.</CardDescription>
      </CardHeader>

      <CardFooter className="ml-auto gap-2">
        {policy.canView && (
          <Link
            href={noteURL}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ExternalLinkIcon /> View
          </Link>
        )}

        <DeleteNoteDialog noteId={note.id} mode={policy.deleteAction} />

        {note.deletedAt && <RestoreNoteDialog noteId={note.id} />}
      </CardFooter>
    </Card>
  );
}
