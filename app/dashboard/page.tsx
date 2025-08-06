import { getNotebooks } from "@/server/notebooks";
import CreateNotebookDialog from "@/components/(notebooks)/create-notebook-button";
import Notebook from "@/components/(notebooks)/notebook";
import { NotebookIcon, ShieldAlert } from "lucide-react";
import Message from "@/components/utils/message";

export default async function Dashboard() {
  const notebooks = await getNotebooks();

  const success = notebooks.success;
  const isNotebooksExist = (notebooks.notebooks?.length ?? 0) > 0;
  let content = null;

  if (!success) {
    content = (
      <Message
        Icon={
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
        }
        description={notebooks.message as string}
      />
    );
  } else if (!isNotebooksExist) {
    content = (
      <Message
        Icon={<NotebookIcon className="text-center size-10 mx-auto mb-3" />}
        description="No notebooks found. Go and create ones"
      >
        <div className="w-fit mx-auto">
          <CreateNotebookDialog />
        </div>
      </Message>
    );
  } else {
    content = (
      <>
        <div className="flex items-center justify-between mb-5">
          <h1>Notebooks</h1>
          <CreateNotebookDialog />
        </div>

        <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
          {notebooks.notebooks?.map((notebook) => (
            <Notebook key={notebook.id} notebook={notebook} />
          ))}
        </div>
      </>
    );
  }

  return content;
}
