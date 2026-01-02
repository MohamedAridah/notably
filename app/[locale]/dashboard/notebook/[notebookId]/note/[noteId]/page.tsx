import { Suspense } from "react";
import { Metadata } from "next";
import { getCachedNoteByIdAction, setNoteFavoriteAction } from "@/server/notes";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import Message from "@/components/utils/message";
import RichTextEditorClient from "@/components/editor/editor.client";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import EditNoteDialog from "@/components/(notes)/edit-note-button";
import DocumentDetails from "@/app/[locale]/dashboard/_components/document-details";
import FavoriteButton from "@/components/utils/favorite-button";
import NoteOptions from "@/components/(notes)/note-options";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Loader2, ShieldAlert } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const noteId = (await params).noteId;
  const { note } = await getCachedNoteByIdAction(noteId);

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
  const { success, note, code } = await getCachedNoteByIdAction(noteId);
  const tPages = await getTranslations("Pages");
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("NoteDetailsPage");
  const tServerCodes = await getTranslations("serverCodes.NOTES");

  let content = null;

  const breadCrumbs = [
    { label: tPages("dashboard"), href: "/dashboard" },
    {
      label: note?.notebook?.name || tCommon("terms.notebook", { count: 1 }),
      href: `/dashboard/notebook/${note?.notebookId}`,
      className: "max-w-40 truncate lg:max-w-none",
    },
    {
      label: note?.title
        ? note.title
        : note?.title !== null
          ? tCommon("terms.note", { count: 1 })
          : "Untitled Note",
      href: `/dashboard/notebook/${note?.notebookId}/note/${note?.id}`,
    },
  ];

  if (!success) {
    return (
      <>
        <BreadCrumbUI breadCrumbs={breadCrumbs} />

        <Message
          Icon={
            <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
          }
          description={
            <>
              <p className="text-lg font-semibold">
                {tServerCodes(code as string)}
              </p>
              <p>{tCommon("something__went__wrong")}</p>
            </>
          }
        />
      </>
    );
  }

  if (!note) {
    content = (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description={t("noteNotFound")}
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
                onToggle={setNoteFavoriteAction}
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
          <div className="flex -items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <NoteOptions
                note={{
                  note_url: `/dashboard/notebook/${note?.notebookId}/note/${note?.id}`,
                  notebook_url: `/dashboard/notebook/${note?.notebookId}`,
                  notebookId: note.notebookId as string,
                  noteId: note.id,
                  isFavorite: note.isFavorite,
                  noteTitle: note.title,
                }}
              />
            </Button>
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
              <p>{t("loadingNoteDetails")}</p>
            </div>
          }
        >
          <DocumentDetails document={note} />
        </Suspense>

        <section className="mt-10 mb-5">
          <RichTextEditorClient content={note.content} noteId={noteId} />
        </section>
      </>
    );
  }

  return (
    <>
      <BreadCrumbUI breadCrumbs={breadCrumbs} />
      {content}
    </>
  );
}
