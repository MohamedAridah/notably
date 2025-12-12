import NoteCard from "@/components/(notes)/note";
import { NoteCardMode } from "./note-mode-policies";
import { NoteCardDefault, NoteCardTrashed } from "@/types/types";

const GridView = ({
  notes,
  noteMode,
}: {
  notes: NoteCardDefault[];
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
