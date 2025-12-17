import { NotebookWithCountAndNotes } from "@/types/types";
import { NotebookCardMode } from "@/components/(notebooks)/notebook-mode-policies";
import NotebookTable from "@/components/(notebooks)/notebook-table";

type Props = {
  notebooks: NotebookWithCountAndNotes[];
  mode?: NotebookCardMode;
  allowFilter?: boolean;
  showHeader?: boolean;
};

const DetailsView = ({
  notebooks,
  mode = "default",
  showHeader,
  allowFilter,
}: Props) => {
  return (
    <NotebookTable
      notebooks={notebooks}
      allowFilter={allowFilter}
      mode={mode}
      showHeader={showHeader}
    />
  );
};

export default DetailsView;
