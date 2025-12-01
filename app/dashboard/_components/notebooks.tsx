"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { NotebookWithNotes } from "@/components/(notebooks)/notebook";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, { DEFAULT_VIEW } from "./view-controller";
import GridView from "@/components/(notebooks)/notebooks-grid-view";
import { Search } from "@/components/utils/search";

const DetailsView = dynamic(
  () => import("@/components/(notebooks)/notebooks-details-view"),
  {
    ssr: false,
    loading: () => <TableSkeketon />,
  }
);

type NotebooksProps = {
  notebook__favorites: NotebookWithNotes[];
  notebook__others: NotebookWithNotes[];
};

type NotebookCategorized = {
  favorites: NotebookWithNotes[];
  others: NotebookWithNotes[];
};

type NotebookDisplayState = {
  isSearching: boolean;
  data: NotebookCategorized | NotebookWithNotes[];
  isEmpty: boolean;
  resultCount: number;
};

const filterNotebooks = (
  notebooks: NotebookWithNotes[],
  searchTerm: string
): NotebookWithNotes[] => {
  if (!searchTerm.trim()) return notebooks;

  const searchLower = searchTerm.toLowerCase();
  return notebooks.filter((notebook) => {
    const notebookMatches = notebook.name.toLowerCase().includes(searchLower);
    const noteMatches = notebook.notes.some((note) =>
      note.title?.toLowerCase().includes(searchLower)
    );
    return notebookMatches || noteMatches;
  });
};

const getDisplayState = (
  favorites: NotebookWithNotes[],
  others: NotebookWithNotes[],
  searchTerm: string
): NotebookDisplayState => {
  const isSearching = searchTerm.trim().length > 0;

  if (isSearching) {
    const allNotebooks = [...favorites, ...others];
    const filteredNotebooks = filterNotebooks(allNotebooks, searchTerm);
    return {
      isSearching: true,
      data: filteredNotebooks,
      isEmpty: filteredNotebooks.length === 0,
      resultCount: filteredNotebooks.length,
    };
  }

  const hasNotebooks = favorites.length > 0 || others.length > 0;
  return {
    isSearching: false,
    data: { favorites, others },
    isEmpty: !hasNotebooks,
    resultCount: favorites.length + others.length,
  };
};

const renderContent = (
  displayState: NotebookDisplayState,
  view: string
): React.ReactNode => {
  if (displayState.isEmpty) {
    return null;
  }

  if (displayState.isSearching) {
    const data = displayState.data as NotebookWithNotes[];
    return view === "grid" ? (
      <GridView notebooks={data} />
    ) : (
      <DetailsView notebooks={data} />
    );
  }

  const { favorites, others } = displayState.data as NotebookCategorized;

  return (
    <>
      {favorites.length > 0 && (
        <section className="mb-5">
          <h2 className="font-thin uppercase mb-3 tracking-wider">Favorites</h2>
          {view === "grid" ? (
            <GridView notebooks={favorites} />
          ) : (
            <DetailsView notebooks={favorites} />
          )}
        </section>
      )}

      {others.length > 0 && (
        <section className="mb-5">
          <h2 className="font-thin uppercase mb-3 tracking-wider">Others</h2>
          {view === "grid" ? (
            <GridView notebooks={others} />
          ) : (
            <DetailsView notebooks={others} />
          )}
        </section>
      )}
    </>
  );
};

const Notebooks = ({ notebooks }: { notebooks: NotebooksProps }) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const displayState = useMemo(
    () =>
      getDisplayState(
        notebooks.notebook__favorites,
        notebooks.notebook__others,
        term
      ),
    [term, notebooks.notebook__favorites, notebooks.notebook__others]
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
          id="search-dashboard"
          className_input="h-8.5"
          placeholder="Search your notebooks..."
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
              ? "No notebooks match your search."
              : "No notebooks found."}
          </p>
        ) : (
          renderContent(displayState, view)
        )}
      </div>
    </>
  );
};

export default Notebooks;
