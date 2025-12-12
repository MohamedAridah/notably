import { NotebookByIdResponseNotes, NoteCardTrashed } from "@/types/types";
import NoteTable from "@/components/(notes)/note-table";
import { NoteCardMode } from "@/components/(notes)/note-mode-policies";

const DetailsView = ({
  notes,
  mode = "default",
}: {
  notes: (NotebookByIdResponseNotes & NoteCardTrashed)[];
  mode?: NoteCardMode;
}) => {
  return <NoteTable notes={notes} mode={mode} showHeader={true} />;
};

export default DetailsView;
