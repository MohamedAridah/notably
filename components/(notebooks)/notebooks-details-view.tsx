import { NotebookWithCountAndNotes } from "@/types/types";
import { NotebookCardMode } from "@/components/(notebooks)/notebook-mode-policies";
import NotebookTable from "@/components/(notebooks)/notebook-table";

type Props = {
  notebooks: NotebookWithCountAndNotes[];
  mode?: NotebookCardMode;
  allowFilter?: boolean;
};

const DetailsView = ({ notebooks, mode = "default", allowFilter }: Props) => {
  return (
    <NotebookTable
      notebooks={notebooks}
      allowFilter={allowFilter}
      mode={mode}
      />
  );
};

export default DetailsView;
