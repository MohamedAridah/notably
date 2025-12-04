import Link from "next/link";
import { Prisma, type Notebook } from "@prisma/client";
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
import { ExternalLinkIcon } from "lucide-react";
import EditNotebookDialog from "./edit-notebook-button";
import FavoriteButton from "../utils/favorite-button";
import NotebookOptions from "./notebook-options";
import { setNotebookFavoriteAction } from "@/server/notebooks";

import {
  NotebookCardMode,
  NotebookModePolicies,
} from "../(notebooks)/notebook-mode-policies";
import RestoreNotebookDialog from "./restore-notebook-button";

export type NotebookWithCount = Notebook & { _count: { notes: number } };
export type NotebookWithNotes = Prisma.NotebookGetPayload<{
  include: {
    _count: { select: { notes: true } };
    notes: { select: { id: true; title: true; isFavorite: true } };
  };
}>;

export default function Notebook({
  notebook,
  mode = "default",
}: {
  notebook: NotebookWithCount;
  mode?: NotebookCardMode;
}) {
  const policy = NotebookModePolicies[mode];
  const notebookURL = `/dashboard/notebook/${notebook.id}`;

  return (
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

            {policy.canOptions && (
              <NotebookOptions
                notebook={notebook}
                alignStart
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              />
            )}
          </div>
        </CardTitle>

        <CardDescription>
         <p>This notebook contains {notebook._count.notes} notes.</p>
        </CardDescription>
      </CardHeader>

      <CardFooter className="ml-auto gap-2">
        {policy.canView && (
          <Link
            href={notebookURL}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ExternalLinkIcon /> View
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
  );
}
