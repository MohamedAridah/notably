import { getNotebooks } from "@/server/notebooks";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import Notebook from "@/components/(notebooks)/notebook";
import { NotebookIcon, ShieldAlert } from "lucide-react";
import Message from "@/components/utils/message";

export default async function Dashboard() {
  const notebooksResponse = await getNotebooks();

  const { success, notebooks, message } = notebooksResponse;

  if (!success) {
    return (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description={message as string}
      />
    );
  }

  const isEmpty = (notebooks?.length ?? 0) === 0;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold">Notebooks</h1>
        <CreateNotebookDialog />
      </div>

      {isEmpty ? (
        <Message
          Icon={<NotebookIcon className="text-center size-10 mx-auto mb-3" />}
          description="No notebooks found. Go and create one!"
        />
      ) : (
        <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
          {notebooks?.map((notebook) => (
            <Notebook key={notebook.id} notebook={notebook} />
          ))}
        </div>
      )}
    </>
  );
}
