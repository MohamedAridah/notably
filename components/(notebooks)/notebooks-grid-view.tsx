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
  const cardWidth = allowFilter
    ? "[repeat(1,1fr)] gap-6"
    : "[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4";

  return (
    <div className={`grid md:grid-cols-${cardWidth}`}>
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
