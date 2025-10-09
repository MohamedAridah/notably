import { getCachedNotebooks } from "@/server/notebooks";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import Message from "@/components/utils/message";
import BreadCrumbUI from "@/components/utils/breadcrumb";
import Notebooks from "./_components/notebooks";
import { NotebookIcon, ShieldAlert } from "lucide-react";
import { filterNotebooks } from "@/helpers/filter-notebooks";
import { NotebookWithCount } from "@/components/(notebooks)/notebook";

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
    filterNotebooks(notebooks ?? []);

  return (
    <>
      <BreadCrumbUI
        breadCrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
      />

      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold">Notebooks</h1>
        <CreateNotebookDialog />
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
            notebook__favorites: notebooks__favorites as NotebookWithCount[],
            notebook__others: notebooks__others as NotebookWithCount[],
          }}
        />
      )}
    </>
  );
}
