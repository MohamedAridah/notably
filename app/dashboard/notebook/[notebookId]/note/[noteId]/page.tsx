import { Suspense } from "react";
import { getNoteById } from "@/server/notes";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import Message from "@/components/utils/message";
import RichTextEditorClient from "@/components/text-editor/editor.client";
import { Loader2, ShieldAlert } from "lucide-react";
import { type JSONContent } from "@tiptap/react";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import EditNoteDialog from "@/components/(notes)/edit-note-button";
import { Metadata } from "next";
import NoteDetails from "./note-details";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const noteId = (await params).noteId;
  const { note } = await getNoteById(noteId);

  return {
    title: note?.title,
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
            <h1 className="text-xl font-semibold">{note?.title}</h1>
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

        <div className="flex flex-col gap-2">
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <Loader2 className="text-center size-5 mb-2 animate-spin" />
                <p>Loading note details...</p>
              </div>
            }
          >
            <NoteDetails note={note} />
          </Suspense>
        </div>

        <section className="my-10">
          <RichTextEditorClient
            content={note.content as JSONContent[]}
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
          },
          {
            label: note?.title || "Note",
            href: `/dashboard/notebook/${note?.notebookId}/note/${note?.id}`,
          },
        ]}
      />

      {content}
    </>
  );
}
