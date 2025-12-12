import { NotebookWithCountAndNotes } from "@/types/types";
import Notebook from "@/components/(notebooks)/notebook";
import { NotebookCardMode } from "@/components/(notebooks)/notebook-mode-policies";

const GridView = ({
  notebooks,
  notebookMode,
  allowFilter,
}: {
  notebooks: NotebookWithCountAndNotes[];
  notebookMode?: NotebookCardMode;
  allowFilter?: boolean;
}) => {
  const cardWidth = allowFilter ? "22rem" : "21rem";

  return (
    <div
      className={`grid md:grid-cols-[repeat(auto-fill,_minmax(${cardWidth},_1fr))] gap-4`}
    >
      {notebooks?.map((notebook) => (
        <Notebook
          key={notebook.id}
          notebook={notebook}
          mode={notebookMode}
          allowFilter={allowFilter}
        />
      ))}
    </div>
  );
};

export default GridView;
