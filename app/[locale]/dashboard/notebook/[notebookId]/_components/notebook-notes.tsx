"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { NotebookByIdResponseNotes, NoteCardDefault } from "@/types/types";
import { useQueryState } from "nuqs";
import GridView from "@/components/(notes)/notebook-notes-grid";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, {
  DEFAULT_VIEW,
} from "@/app/[locale]/dashboard/_components/view-controller";
import { Search } from "@/components/utils/search";
import { useTranslations } from "next-intl";
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

const filterNotes = (
  notes: NoteCardDefault[],
  searchTerm: string
): NoteCardDefault[] => {
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
  const tSForm = useTranslations("SearchForm");
  const tCommon = useTranslations("Common.terms");
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const displayState = useMemo(
    () => getDisplayState(notes, term),
    [term, notes]
  );

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
          aria-label={tSForm("placeholder.notes")}
          placeholder={tSForm("placeholder.notes")}
        />
        <ViewController />
      </div>

      {displayState.isSearching && (
        <p className="mb-4">
          {displayState.isEmpty
            ? tSForm("state.noMatchGeneral")
            : tSForm("state.withMatchMessage", {
                count: displayState.resultCount,
              })}
          <span className="font-bold">&quot;{term}&quot;</span>
        </p>
      )}

      <div>
        {displayState.isEmpty ? (
          <p className="text-muted-foreground text-center py-8">
            {displayState.isSearching
              ? tSForm("state.noMatchMessage", {
                  term: tCommon("note", { count: 2 }),
                })
              : tSForm("state.notFoundMessage", {
                  term: tCommon("note", { count: 2 }),
                })}
          </p>
        ) : (
          renderContent(displayState, view)
        )}
      </div>
    </>
  );
};

export default NotebookNotes;
