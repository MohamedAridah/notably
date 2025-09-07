import { Note } from "@prisma/client";
import NoteCard from "@/components/(notes)/note";

const GridView = ({ notes }: { notes: Note[] }) => {
  return (
    <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(21rem,_1fr))] gap-4 mt-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default GridView;
