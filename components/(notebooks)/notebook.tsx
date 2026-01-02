import Link from "next/link";
import { NotebookWithCountAndNotes, NoteCardDefault } from "@/types/types";
import { setNotebookFavoriteAction } from "@/server/notebooks";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import DeleteNotebookDialog from "@/components/(notebooks)/delete-notebook-button";
import EditNotebookDialog from "@/components/(notebooks)/edit-notebook-button";
import NotebookOptions from "@/components/(notebooks)/notebook-options";
import RestoreNotebookDialog from "@/components/(notebooks)/restore-notebook-button";
import FavoriteButton from "@/components/utils/favorite-button";
import NotebookNestedNotes from "@/components/(notebooks)/notebook-nested-notes";
import {
  NotebookCardMode,
  NotebookModePolicies,
} from "@/components/(notebooks)/notebook-mode-policies";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Notebook({
  notebook,
  mode = "default",
  allowFilter = false,
}: {
  notebook: NotebookWithCountAndNotes;
  mode?: NotebookCardMode;
  allowFilter?: boolean;
}) {
  const t = useTranslations("NotebookCard");
  const tCommon = useTranslations("Common.actions");
  const policy = NotebookModePolicies[mode];
  const notebookURL = `/dashboard/notebook/${notebook.id}`;
  const hasNestedNotes = notebook.notes && notebook.notes.length > 0;

  return (
    <div>
      <Card className="shadow-xs hover:shadow-sm transition-shadow ease-in-out duration-150">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 group/notebook-buttons">
              <div className="flex items-center gap-1.5">
                {policy.canFavorite && (
                  <FavoriteButton
                    isFavorite={notebook.isFavorite}
                    id={notebook.id}
                    onToggle={setNotebookFavoriteAction}
                    disabled={!policy.favoriteInteractive}
                  />
                )}

                {policy.canView ? (
                  <Link
                    href={notebookURL}
                    className="hover:underline underline-offset-3"
                  >
                    {notebook.name}
                  </Link>
                ) : (
                  <span>{notebook.name}</span>
                )}
              </div>

              {policy.canEdit && !notebook.isDefault && (
                <EditNotebookDialog
                  notebookId={notebook.id}
                  notebook={notebook}
                  trigger={{ asIcon: true, asIconHidden: true }}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className="tabular-nums">{notebook._count.notes}</Badge>

              <NotebookOptions
                mode={mode}
                notebook={notebook}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              />
            </div>
          </CardTitle>

          <CardDescription>
            <p>{t("description", { count: notebook._count.notes })}</p>
            {mode === "trash" && <p className="mt-1">{t("restore")}</p>}
          </CardDescription>
        </CardHeader>

        <CardFooter className="ml-auto gap-2">
          {policy.canView && (
            <Link
              href={notebookURL}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <SquareArrowOutUpRightIcon /> {tCommon("view")}
            </Link>
          )}

          <DeleteNotebookDialog
            notebookId={notebook.id}
            notebookName={notebook.name}
            mode={policy.deleteAction}
          />

          {notebook.deletedAt && (
            <RestoreNotebookDialog
              notebookId={notebook.id}
              notebookName={notebook.name}
            />
          )}
        </CardFooter>
      </Card>

      {hasNestedNotes && allowFilter && (
        <NotebookNestedNotes
          notes={notebook.notes as NoteCardDefault[]}
          notebookId={notebook.id}
        />
      )}
    </div>
  );
}
