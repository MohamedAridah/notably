import { getNotebookById } from "@/server/notebooks";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import NoteCard from "@/components/(notes)/note";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import { NotebookText, ShieldAlert } from "lucide-react";
import Message from "@/components/utils/message";
import { Badge } from "@/components/ui/badge";

type Params = Promise<{
  notebookId: string;
}>;
export default async function NotebookPage({ params }: { params: Params }) {
  const notebookId = (await params).notebookId;
  const { notebook } = await getNotebookById(notebookId);
  let content = null;

  if (!notebook) {
    content = (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description="Notebook is not found"
      />
    );
  } else if (notebook.notes.length === 0) {
    content = (
      <Message
        Icon={<NotebookText className="text-center size-10 mx-auto mb-" />}
        description="No notes yet. Create your first note!"
      />
    );
  } else {
    content = (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{notebook?.name}</h1>
          <CreateNoteDialog />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm">
            Created at:{" "}
            <span>{new Date(notebook?.createdAt as Date).toDateString()}</span>
          </p>
          <p className="text-sm">
            Last updated at:{" "}
            <span>{new Date(notebook?.updatedAt as Date).toDateString()}</span>
          </p>
        </div>

        <section className="my-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {notebook.name} Notes: <Badge>{notebook._count.notes}</Badge>
          </h2>
          <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4 mt-4">
            {notebook?.notes?.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BreadCrumbUI
        breadCrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          {
            label: notebook?.name || "Notebook",
            href: `/dashboard/notebook/${notebookId}`,
          },
        ]}
      />

      {content}
    </>
  );
}
