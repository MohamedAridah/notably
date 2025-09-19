import Link from "next/link";
import { type Notebook } from "@prisma/client";
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
import { handleToggleFavorite_Notebook } from "@/lib/utils";

export type NotebookWithCount = Notebook & { _count: { notes: number } };

export default function Notebook({
  notebook,
}: {
  notebook: Notebook & NotebookWithCount;
}) {
  return (
    <Card className="shadow-xs hover:shadow-sm transition-shadow ease-in-out duration-150">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 group/notebook-buttons">
            <div className="flex items-center gap-1">
              <FavoriteButton
                isFavorite={notebook.isFavorite}
                id={notebook.id}
                onToggle={handleToggleFavorite_Notebook}
              />
              {notebook.name}
            </div>
            <EditNotebookDialog
              notebookId={notebook.id}
              notebook={notebook}
              trigger={{ asIcon: true, asIconHidden: true }}
            />
          </div>
          <Badge className="tabular-nums">{notebook._count.notes}</Badge>
        </CardTitle>
        <CardDescription>
          <p>{notebook._count.notes ?? 0} notes</p>
        </CardDescription>
      </CardHeader>

      <CardFooter className="ml-auto gap-2">
        <Link
          href={"/dashboard/notebook/" + notebook.id}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLinkIcon /> View
        </Link>
        <DeleteNotebookDialog
          notebookId={notebook.id}
          callbackURL="/dashboard"
        />
      </CardFooter>
    </Card>
  );
}
