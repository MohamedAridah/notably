import Link from "next/link";
import { NoteCardDefault, NoteCardTrashed } from "@/types/types";
import { setNoteFavoriteAction } from "@/server/notes";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import EditNoteDialog from "@/components/(notes)/edit-note-button";
import FavoriteButton from "@/components/utils/favorite-button";
import NoteOptions from "@/components/(notes)/note-options";
import RestoreNoteDialog from "@/components/(notes)/restore-note-button";
import {
  NoteCardMode,
  NoteModePolicies,
} from "@/components/(notes)/note-mode-policies";
import { ExternalLinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoteCard({
  note,
  mode = "default",
}: {
  note: NoteCardDefault & Partial<NoteCardTrashed>;
  mode?: NoteCardMode;
}) {
  const t = useTranslations("NoteCard");
  const tCommon = useTranslations("Common.actions");
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
                  disabled={!policy.favoriteInteractive}
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
        <CardDescription>
          {mode === "default" ? (
            t(`${mode}`)
          ) : (
            <>
              <p className="mt-1">
                {t.rich("trash", {
                  notebookName: note.notebook!.name,
                  NotebookName: (chunks) => (
                    <Link
                      href={notebookURL}
                      className="font-semibold hover:underline underline-offset-3"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <p className="mt-1">{t("restore")}</p>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardFooter className="ml-auto gap-2">
        {policy.canView && (
          <Link
            href={noteURL}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ExternalLinkIcon /> {tCommon("view")}
          </Link>
        )}

        <DeleteNoteDialog noteId={note.id} mode={policy.deleteAction} />

        {note.deletedAt && <RestoreNoteDialog noteId={note.id} />}
      </CardFooter>
    </Card>
  );
}
