import Notebook, { NotebookWithCount } from "@/components/(notebooks)/notebook";
import { NotebookCardMode } from "@/components/(notebooks)/notebook-mode-policies";

const GridView = ({
  notebooks,
  notebookMode,
}: {
  notebooks: NotebookWithCount[];
  notebookMode?: NotebookCardMode;
}) => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
      {notebooks?.map((notebook) => (
        <Notebook key={notebook.id} notebook={notebook} mode={notebookMode} />
      ))}
    </div>
  );
};

export default GridView;
