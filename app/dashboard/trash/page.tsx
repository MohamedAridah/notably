import Link from "next/link";
import { getCachedTrashedNotebooksAction } from "@/server/notebooks";
import { getCachedTrashedNotesAction } from "@/server/notes";
import Message from "@/components/utils/message";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import { Button } from "@/components/ui/button";
import TrashUI from "./_components/trash-ui";
import EmptyTrashDialog from "./_components/empty-trash-button";
import { ArrowLeftIcon, NotebookIcon } from "lucide-react";
import { NotebookWithCountAndNotes } from "@/types/types";

export const metadata = {
  description:
    "View and manage your deleted notebooks in the trash section of your dashboard.",
};

export default async function Trash() {
  const [notebooksRes, notesRes] = await Promise.all([
    getCachedTrashedNotebooksAction(),
    getCachedTrashedNotesAction(),
  ]);

  const breadCrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Trash", href: "/dashboard/trash" },
  ];

  // if (!success ) {
  //   return (
  //     <Message
  //       Icon={
  //         <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
  //       }
  //       description={
  //         <>
  //           <p className="text-lg font-semibold">{message as string}</p>
  //           <p>{description || "Sorry, something went wrong."}</p>
  //         </>
  //       }
  //     />
  //   );
  // }

  const isEmpty =
    ((notebooksRes.notebooks?.length || notesRes.notes?.length) ?? 0) === 0;

  return (
    <>
      <BreadCrumbUI breadCrumbs={breadCrumbs} />

      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold">Trash</h1>
        {!isEmpty && <EmptyTrashDialog />}
      </div>

      {isEmpty ? (
        <Message
          Icon={<NotebookIcon className="text-center size-10 mx-auto mb-3" />}
          description={
            <>
              <p className="mb-2">
                Trash is empty. There are no items in the trash.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeftIcon /> Back to Dashboard
                </Link>
              </Button>
            </>
          }
        />
      ) : (
        <TrashUI
          notebooks={notebooksRes.notebooks as NotebookWithCountAndNotes[]}
          notes={notesRes.notes as any}
        />
      )}
    </>
  );
}
