import BreadCrumbUI from "@/components/utils/breadcrumb";
import { getNoteById } from "@/server/notes";

type Params = Promise<{
  noteId: string;
}>;
export default async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params;
  const { note } = await getNoteById(noteId);

  return (
    <>
      <BreadCrumbUI
        breadCrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          {
            label: note?.notebook?.name || "Notebook",
            href: `/dashboard/notebook/${note?.notebookId}`,
          },
          {
            label: note?.title || "Note",
            href: `/dashboard/notebook/${note?.notebookId}/note/${note?.id}`,
          },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1>{note?.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <pre>{JSON.stringify(note, null, 2)}</pre>
      </div>
    </>
  );
}
