import { getCachedNotebooks } from "@/server/notebooks";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import Message from "@/components/utils/message";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import Notebooks from "./_components/notebooks";
import { NotebookIcon, ShieldAlert } from "lucide-react";
import { classifyNotebooks } from "@/helpers/classify-notebooks";
import { NotebookWithNotes } from "@/components/(notebooks)/notebook";
import CreateNoteDialog from "@/components/(notes)/create-note-button";

export const metadata = {
  description:
    "Overview of your notebooks including favorites and other notebooks. Create, view, and manage your notebooks easily from the dashboard.",
};

export default async function Dashboard() {
  const notebooksResponse = await getCachedNotebooks();
  const { success, notebooks, message, description } = notebooksResponse;

  if (!success) {
    return (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description={
          <>
            <p className="text-lg font-semibold">{message as string}</p>
            <p>{description || "Sorry, something went wrong."}</p>
          </>
        }
      />
    );
  }

  const isEmpty = (notebooks?.length ?? 0) === 0;
  const { favorites: notebooks__favorites, others: notebooks__others } =
    await classifyNotebooks(notebooks ?? []);

  return (
    <>
      <BreadCrumbUI
        breadCrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
      />

      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold">Notebooks</h1>
        <div className="flex items-center gap-2">
          <CreateNoteDialog />
          <CreateNotebookDialog />
        </div>
      </div>

      {isEmpty ? (
        <Message
          Icon={<NotebookIcon className="text-center size-10 mx-auto mb-3" />}
          description={
            <>
              <p className="mb-2">No notebooks found. Go and create one!</p>
              <CreateNotebookDialog buttonStyles={{ variant: "outline" }} />
            </>
          }
        />
      ) : (
        <Notebooks
          notebooks={{
            notebook__favorites: notebooks__favorites as NotebookWithNotes[],
            notebook__others: notebooks__others as NotebookWithNotes[],
          }}
        />
      )}
    </>
  );
}
