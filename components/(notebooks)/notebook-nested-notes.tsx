import { NoteCardDefault, NoteCardTrashed } from "@/types/types";
import NoteCard from "@/components/(notes)/note";

interface NotebookNestedNotesProps {
  notes: NoteCardDefault[];
  notebookId: string;
}

export default function NotebookNestedNotes({
  notes,
  notebookId,
}: NotebookNestedNotesProps) {
  return (
    <ul className="border-sidebar-border ms-4 flex flex-col gap-3 border-l ps-2.5 py-0.5 pt-4">
      {notes.map((note) => (
        <li className="relative ps-2" key={note.id}>
          <div className="absolute h-4 w-[19px] top-1/4 left-[-10px] border-b-2 border-b-sidebar-border rounded-bl-lg"></div>

          <NoteCard
            note={{ ...note, notebookId } as NoteCardDefault & NoteCardTrashed}
          />
        </li>
      ))}
    </ul>
  );
}
