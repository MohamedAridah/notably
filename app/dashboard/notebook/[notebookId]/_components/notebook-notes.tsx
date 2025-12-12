"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { NotebookByIdResponseNotes, NoteCardDefault } from "@/types/types";
import { useQueryState } from "nuqs";
import GridView from "@/components/(notes)/notebook-notes-grid";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, {
  DEFAULT_VIEW,
} from "@/app/dashboard/_components/view-controller";
import { Search } from "@/components/utils/search";
const DetailsView = dynamic(
  () => import("@/components/(notes)/notebook-notes-details"),
  {
    ssr: false,
    loading: () => <TableSkeketon />,
  }
);

type NoteDisplayState = {
  isSearching: boolean;
  data: NoteCardDefault[];
  isEmpty: boolean;
  resultCount: number;
};

const filterNotes = (notes: NoteCardDefault[], searchTerm: string): NoteCardDefault[] => {
  if (!searchTerm.trim()) return notes;

  const searchLower = searchTerm.toLowerCase();
  return notes.filter((note) => {
    const noteTitle = note.title ?? "untitled note";
    return noteTitle.toLowerCase().includes(searchLower);
  });
};

const getDisplayState = (
  notes: NoteCardDefault[],
  searchTerm: string
): NoteDisplayState => {
  const isSearching = searchTerm.trim().length > 0;
  const filteredNotes = isSearching ? filterNotes(notes, searchTerm) : notes;

  return {
    isSearching,
    data: filteredNotes,
    isEmpty: filteredNotes.length === 0,
    resultCount: filteredNotes.length,
  };
};

const renderContent = (
  displayState: NoteDisplayState,
  view: string
): React.ReactNode => {
  if (displayState.isEmpty) {
    return null;
  }

  const data = displayState.data;
  return view === "grid" ? (
    <GridView notes={data} />
  ) : (
    <DetailsView notes={data as NotebookByIdResponseNotes[]} />
  );
};

const NotebookNotes = ({ notes }: { notes: NotebookByIdResponseNotes[] }) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const displayState = useMemo(
    () => getDisplayState(notes, term),
    [term, notes]
  );

  const resultText = displayState.resultCount === 1 ? "result" : "results";

  return (
    <>
      <div
        className={`flex gap-1 sm:gap-2 items-center ${
          displayState.isSearching ? "" : "mb-4"
        }`}
      >
        <Search
          query="q"
          id="search-notebook-notes"
          className_input="h-8.5"
          placeholder="Search notes in this notebook..."
        />
        <ViewController />
      </div>

      {displayState.isSearching && (
        <p className="mb-4">
          {displayState.isEmpty
            ? "There are no data that matches "
            : `Showing ${displayState.resultCount} ${resultText} for `}
          <span className="font-bold">&quot;{term}&quot;</span>
        </p>
      )}

      <div>
        {displayState.isEmpty ? (
          <p className="text-muted-foreground text-center py-8">
            {displayState.isSearching
              ? "No notes match your search."
              : "No notes found."}
          </p>
        ) : (
          renderContent(displayState, view)
        )}
      </div>
    </>
  );
};

export default NotebookNotes;
