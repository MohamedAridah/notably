import NoteCard from "@/components/(notes)/note";
import { NoteScoped } from "@/app/dashboard/notebook/[notebookId]/_components/notebook-notes";
import { NoteCardMode } from "./note-mode-policies";

const GridView = ({
  notes,
  noteMode
}: {
  notes: NoteScoped[];
  noteMode?: NoteCardMode;
}) => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} mode={noteMode}/>
      ))}
    </div>
  );
};

export default GridView;
