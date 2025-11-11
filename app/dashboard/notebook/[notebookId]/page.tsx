import { Metadata } from "next";
import { getCachedNotebook } from "@/server/notebooks";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import { Loader2, NotebookText, ShieldAlert } from "lucide-react";
import Message from "@/components/utils/message";
import { Badge } from "@/components/ui/badge";
import EditNotebookDialog from "@/components/(notebooks)/edit-notebook-button";
import DeleteNotebookDialog from "@/components/(notebooks)/delete-notebook-button";
import NotebookNotes from "./_components/notebook-notes";
import DocumentDetails from "../../_components/document-details";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const notebookId = (await params).notebookId;
  const { notebook } = await getCachedNotebook(notebookId);

  return {
    title: notebook?.name,
  };
}

type Params = Promise<{
  notebookId: string;
}>;

export default async function NotebookPage({ params }: { params: Params }) {
  const notebookId = (await params).notebookId;
  const { notebook } = await getCachedNotebook(notebookId);

  const breadCrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: notebook?.name || "Notebook",
      href: `/dashboard/notebook/${notebookId}`,
    },
  ];

  if (!notebook) {
    return (
      <>
        <BreadCrumbUI breadCrumbs={breadCrumbs} />
        <Message
          Icon={
            <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
          }
          description="Notebook is not found"
        />
      </>
    );
  }

  return (
    <>
      <BreadCrumbUI breadCrumbs={breadCrumbs} />

      <div className="flex items-center justify-between group-hover/notebook-buttons:opacity-100">
        <div className="flex items-center gap-2 group/notebook-buttons">
          <h1 className="text-xl font-semibold">{notebook.name}</h1>
          {!notebook.isDefault && (
            <div className="flex items-center gap-1">
              <EditNotebookDialog
                notebookId={notebookId}
                notebook={notebook}
                trigger={{ asIcon: true, asIconHidden: true }}
              />
              <div className="flex -items-center gap-2">
                <DeleteNotebookDialog
                  notebookId={notebookId}
                  callbackURL={"/dashboard"}
                  trigger={{ asIcon: true, asIconHidden: true }}
                />
              </div>
            </div>
          )}
        </div>

        <CreateNoteDialog notebookId={notebookId} />
      </div>
      
      <Suspense
        fallback={
          <div className="flex items-center gap-2">
            <Loader2 className="text-center size-5 mb-2 animate-spin" />
            <p>Loading notebook details...</p>
          </div>
        }
      >
        <DocumentDetails document={notebook} />
      </Suspense>

      <section className="my-10">
        {notebook.notes.length === 0 ? (
          <Message
            Icon={<NotebookText className="text-center size-10 mx-auto mb-3" />}
            description="No notes yet. Create your first note now!"
          />
        ) : (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {notebook.name} Notes: <Badge>{notebook._count.notes}</Badge>
            </h2>

            <NotebookNotes notes={notebook.notes} />
          </>
        )}
      </section>
    </>
  );
}
