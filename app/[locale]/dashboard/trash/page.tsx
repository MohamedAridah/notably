import Link from "next/link";
import { getCachedTrashedNotebooksAction } from "@/server/notebooks";
import { getCachedTrashedNotesAction } from "@/server/notes";
import Message from "@/components/utils/message";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import { Button } from "@/components/ui/button";
import TrashUI from "./_components/trash-ui";
import EmptyTrashDialog from "./_components/empty-trash-button";
import { ArrowLeftIcon, Trash2 } from "lucide-react";
import { NotebookWithCountAndNotes } from "@/types/types";
import { getTranslations } from "next-intl/server";

export const metadata = {
  description:
    "View and manage your deleted notebooks in the trash section of your dashboard.",
};

export default async function Trash() {
  const [notebooksRes, notesRes] = await Promise.all([
    getCachedTrashedNotebooksAction(),
    getCachedTrashedNotesAction(),
  ]);
  const tPages = await getTranslations("Pages");
  const t = await getTranslations("TrashPage");

  const breadCrumbs = [
    { label: tPages("dashboard"), href: "/dashboard" },
    { label: tPages("trash"), href: "/dashboard/trash" },
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
        <h1 className="font-semibold">{tPages("trash")}</h1>
        {!isEmpty && <EmptyTrashDialog />}
      </div>

      {isEmpty ? (
        <Message
          Icon={
            <Trash2 className="text-center size-10 mx-auto mb-3 text-destructive" />
          }
          description={
            <>
              <p className="mb-2">{t("emptyTrash")}</p>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeftIcon /> {t("goToDashboard")}
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
