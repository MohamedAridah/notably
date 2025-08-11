import { getNotebookById } from "@/server/notebooks";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import NoteCard from "@/components/(notes)/note";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import { NotebookText, PenBoxIcon, ShieldAlert } from "lucide-react";
import Message from "@/components/utils/message";
import { Badge } from "@/components/ui/badge";
import EditNotebookDialog from "@/components/(notebooks)/edit-notebook-button";
import DeleteNotebookDialog from "@/components/(notebooks)/delete-notebook-button";

type Params = Promise<{
  notebookId: string;
}>;

export default async function NotebookPage({ params }: { params: Params }) {
  const notebookId = (await params).notebookId;
  const { notebook } = await getNotebookById(notebookId);

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
          <div className="flex items-center gap-1">
            <EditNotebookDialog
              notebookId={notebookId}
              notebook={notebook}
              asIcon
              iconHidden
            />
            <div className="flex -items-center gap-2">
              <DeleteNotebookDialog notebookId={notebookId} asIcon iconHidden />
            </div>
          </div>
        </div>

        <CreateNoteDialog notebookId={notebookId} />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <p className="text-sm">
          Created at: <span>{new Date(notebook.createdAt).toDateString()}</span>
        </p>
        <p className="text-sm">
          Last updated at:{" "}
          <span>{new Date(notebook.updatedAt).toDateString()}</span>
        </p>
      </div>

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
            <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4 mt-4">
              {notebook.notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
