import Link from "next/link";
import { type Notebook } from "@prisma/client";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import DeleteNotebookDialog from "@/components/(notebooks)/delete-notebook-button";
import { ExternalLinkIcon } from "lucide-react";
import EditNotebookDialog from "./edit-notebook-button";

type NotebookWithCount = Notebook & { _count: { notes: number } };

export default function Notebook({
  notebook,
}: {
  notebook: Notebook & NotebookWithCount;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 group/notebook-buttons">
            {notebook.name}
            <EditNotebookDialog
              notebookId={notebook.id}
              notebook={notebook}
              asIcon
              iconHidden
            />
          </div>
          <Badge className="tabular-nums">{notebook._count.notes}</Badge>
        </CardTitle>
      </CardHeader>
      <CardFooter className="ml-auto gap-2">
        <Link
          href={"/dashboard/notebook/" + notebook.id}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLinkIcon /> View
        </Link>
        <DeleteNotebookDialog notebookId={notebook.id} />
      </CardFooter>
    </Card>
  );
}
