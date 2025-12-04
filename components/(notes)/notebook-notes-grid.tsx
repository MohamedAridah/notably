import NoteCard, { NoteScopedWithNotebookName } from "@/components/(notes)/note";
import { NoteCardMode } from "./note-mode-policies";

const GridView = ({
  notes,
  noteMode,
}: {
  notes: NoteScopedWithNotebookName[];
  noteMode?: NoteCardMode;
}) => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} mode={noteMode} />
      ))}
    </div>
  );
};

export default GridView;
