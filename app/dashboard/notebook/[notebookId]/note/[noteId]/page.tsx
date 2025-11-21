import { Suspense } from "react";
import { getNoteById, setNoteFavorite } from "@/server/notes";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import Message from "@/components/utils/message";
import RichTextEditorClient from "@/components/editor/editor.client";
import { Loader2, ShieldAlert } from "lucide-react";
import { type JSONContent } from "@tiptap/react";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import EditNoteDialog from "@/components/(notes)/edit-note-button";
import { Metadata } from "next";
import DocumentDetails from "@/app/dashboard/_components/document-details";
import FavoriteButton from "@/components/utils/favorite-button";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const noteId = (await params).noteId;
  const { note } = await getNoteById(noteId);

  return {
    title: note?.title || "Untitled Note",
    description:
      "View and edit your note easily. Manage note details, content, and organization within your notebooks.",
  };
}

type Params = Promise<{
  noteId: string;
}>;

export default async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params;
  const { note } = await getNoteById(noteId);

  let content = null;

  if (!note) {
    content = (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description="Note is not found"
      />
    );
  } else {
    content = (
      <>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 group/note-buttons">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-semibold">
                {note?.title || "Untitled Note"}
              </h1>
              <FavoriteButton
                isFavorite={note.isFavorite}
                id={note.id}
                onToggle={setNoteFavorite}
              />
            </div>
            <div className="flex items-center gap-1">
              <EditNoteDialog
                note={note}
                noteId={note.id}
                trigger={{ asIcon: true, asIconHidden: true }}
              />
              <DeleteNoteDialog
                noteId={note.id}
                trigger={{ asIcon: true, asIconHidden: true }}
                callbackURL={`/dashboard/notebook/${note.notebookId}`}
              />
            </div>
          </div>
          <div className="flex -items-center gap-2">
            <DeleteNoteDialog
              noteId={noteId}
              callbackURL={`/dashboard/notebook/${note.notebookId}`}
            />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              <Loader2 className="text-center size-5 mb-2 animate-spin" />
              <p>Loading note details...</p>
            </div>
          }
        >
          <DocumentDetails document={note} />
        </Suspense>

        <section className="mt-10 mb-5">
          <RichTextEditorClient
            content={note.content ?? ({} as JSONContent[])}
            noteId={noteId}
          />
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
            label: note?.notebook?.name || "Notebook",
            href: `/dashboard/notebook/${note?.notebookId}`,
            className: "max-w-40 truncate lg:max-w-none",
          },
          {
            label: note?.title
              ? note.title
              : note?.title !== null
                ? "Note"
                : "Untitled Note",
            href: `/dashboard/notebook/${note?.notebookId}/note/${note?.id}`,
          },
        ]}
      />
      {content}
    </>
  );
}
