"use client";

import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import {
  NotebookWithCount,
  NotebookWithNotes,
} from "@/components/(notebooks)/notebook";
import TableSkeketon from "@/components/(skeletons)/table";
import NotebooksGridView from "@/components/(notebooks)/notebooks-grid-view";
import NotesGridView from "@/components/(notes)/notebook-notes-grid";
import { Search } from "@/components/utils/search";
import { useMemo } from "react";
import { Note, Notebook } from "@prisma/client";
import ViewController, {
  DEFAULT_VIEW,
} from "../../_components/view-controller";
import { NotebookIcon, NotebookTextIcon } from "lucide-react";
import { NoteScoped } from "../../notebook/[notebookId]/_components/notebook-notes";
import { NoteScopedWithNotebookName } from "@/components/(notes)/notebook-notes-details";
const NotebookDetailsView = dynamic(
  () => import("@/components/(notebooks)/notebooks-details-view"),
  {
    ssr: false,
    loading: () => <TableSkeketon />,
  }
);
const NoteDetailsView = dynamic(
  () => import("@/components/(notes)/notebook-notes-details"),
  {
    ssr: false,
    loading: () => <TableSkeketon />,
  }
);

type TrashUIProps = {
  notebooks: Notebook[];
  notes?: Partial<Note>[];
};

/**
 * Helper to filter out notes that belong to trashed notebooks
 * We only show standalone trashed notes (not part of a trashed notebook)
 */
const getStandaloneDeletedNotes = (
  notes: Partial<Note>[],
  trashedNotebookIds: string[]
): Partial<Note>[] => {
  return notes.filter(
    (note) => !trashedNotebookIds.includes(note.notebookId || "")
  );
};

type TrashDisplayState = {
  isSearching: boolean;
  notebooks: Notebook[];
  notes: Partial<Note>[]; // Only standalone deleted notes
  isEmpty: boolean;
};

/**
 * Prepares display state for trash items
 * Filters out notes that belong to trashed notebooks
 */
const getTrashDisplayState = (
  allNotebooks: Notebook[],
  allNotes: Partial<Note>[],
  searchTerm: string
): TrashDisplayState => {
  const isSearching = searchTerm.trim().length > 0;
  const trashedNotebookIds = allNotebooks.map((nb) => nb.id);

  // Get standalone deleted notes (not part of a trashed notebook)
  const standaloneNotes = getStandaloneDeletedNotes(
    allNotes,
    trashedNotebookIds
  );

  if (isSearching) {
    const searchLower = searchTerm.toLowerCase();
    const filteredNotebooks = allNotebooks.filter((notebook) =>
      notebook.name.toLowerCase().includes(searchLower)
    );
    const filteredNotes = standaloneNotes.filter((note) =>
      (note.title ?? "Untitled Note").toLowerCase().includes(searchLower)
    );

    return {
      isSearching: true,
      notebooks: filteredNotebooks,
      notes: filteredNotes,
      isEmpty: filteredNotebooks.length === 0 && filteredNotes.length === 0,
    };
  }

  return {
    isSearching: false,
    notebooks: allNotebooks,
    notes: standaloneNotes,
    isEmpty: allNotebooks.length === 0 && standaloneNotes.length === 0,
  };
};

/**
 * Renders trash content based on display state and view mode
 */
const renderTrashContent = (
  displayState: TrashDisplayState,
  view: string
): React.ReactNode => {
  if (displayState.isEmpty) {
    return null;
  }

  return (
    <>
      {displayState.notebooks.length > 0 && (
        <section className="mb-5">
          <h2 className="flex items-center gap-1 font-thin uppercase mb-3 tracking-wider">
            <NotebookIcon className="size-4" /> Notebooks
          </h2>
          {view === "grid" && (
            <NotebooksGridView
              notebooks={displayState.notebooks as NotebookWithCount[]}
              notebookMode="trash"
            />
          )}
          {view === "rows" && (
            <NotebookDetailsView
              notebooks={displayState.notebooks as NotebookWithNotes[]}
              mode="trash"
            />
          )}
        </section>
      )}

      {displayState.notes.length > 0 && (
        <section className="mb-5">
          <h2 className="flex items-center gap-1 font-thin uppercase mb-3 tracking-wider">
            <NotebookTextIcon className="size-4" /> Notes
          </h2>
          {view === "grid" && (
            <NotesGridView
              notes={displayState.notes as NoteScoped[]}
              noteMode="trash"
            />
          )}
          {view === "rows" && (
            <NoteDetailsView
              notes={displayState.notes as NoteScopedWithNotebookName[]}
              mode="trash"
            />
          )}
        </section>
      )}
    </>
  );
};

const TrashUI = ({ notebooks, notes = [] }: TrashUIProps) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const displayState = useMemo(
    () => getTrashDisplayState(notebooks, notes, term),
    [term, notebooks, notes]
  );

  const resultText =
    displayState.notebooks.length + displayState.notes.length > 1
      ? "results"
      : "result";

  return (
    <>
      {/* Search Bar and View Controller */}
      <div
        className={`flex gap-1 sm:gap-2 items-center ${
          displayState.isSearching ? "" : "mb-4"
        }`}
      >
        <Search
          query="q"
          id="search-dashboard"
          className_input="h-8.5"
          placeholder="Search your trashed notebooks..."
        />
        <ViewController />
      </div>

      {/* Search Results Info */}
      {displayState.isSearching && (
        <p className="mb-4">
          {displayState.isEmpty
            ? "There are no data that matches "
            : `Showing ${displayState.notebooks.length + displayState.notes.length} ${resultText} for `}
          <span className="font-bold">&quot;{term}&quot;</span>
        </p>
      )}

      {/* Content Area */}
      <div role="main" aria-label="Trash items">
        {displayState.isEmpty ? (
          <p className="text-muted-foreground text-center py-8" role="status">
            {displayState.isSearching
              ? "No items match your search."
              : "Trash is empty."}
          </p>
        ) : (
          renderTrashContent(displayState, view)
        )}
      </div>
    </>
  );
};

export default TrashUI;
