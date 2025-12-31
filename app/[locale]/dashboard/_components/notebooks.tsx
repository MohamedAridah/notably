"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { NotebookWithCountAndNotes } from "@/types/types";
import { useQueryState } from "nuqs";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, { DEFAULT_VIEW } from "./view-controller";
import GridView from "@/components/(notebooks)/notebooks-grid-view";
import { Search } from "@/components/utils/search";
import { _Translator, useTranslations } from "next-intl";
const DetailsView = dynamic(
  () => import("@/components/(notebooks)/notebooks-details-view"),
  {
    ssr: false,
    loading: () => <TableSkeketon />,
  }
);

type NotebooksProps = {
  favorites: NotebookWithCountAndNotes[];
  others: NotebookWithCountAndNotes[];
};

type NotebookCategorized = NotebooksProps;

type NotebookDisplayState = {
  isSearching: boolean;
  data: NotebookCategorized | NotebookWithCountAndNotes[];
  isEmpty: boolean;
  resultCount: number;
};

const filterNotebooks = (
  notebooks: NotebookWithCountAndNotes[],
  searchTerm: string
): NotebookWithCountAndNotes[] => {
  if (!searchTerm.trim()) return notebooks;

  const searchLower = searchTerm.toLowerCase();
  return notebooks.reduce((acc, notebook) => {
    const notebookMatches = notebook.name.toLowerCase().includes(searchLower);
    const matchedNotes = notebook.notes.filter((note) =>
      note.title?.toLowerCase().includes(searchLower)
    );

    if (notebookMatches || matchedNotes.length > 0) {
      acc.push({
        ...notebook,
        notes: matchedNotes,
      });
    }

    return acc;
  }, [] as NotebookWithCountAndNotes[]);
};

const getDisplayState = (
  favorites: NotebookWithCountAndNotes[],
  others: NotebookWithCountAndNotes[],
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
  view: string,
  translation: _Translator<Record<string, any>>
): React.ReactNode => {
  if (displayState.isEmpty) {
    return null;
  }

  if (displayState.isSearching) {
    const data = displayState.data as NotebookWithCountAndNotes[];
    return view === "grid" ? (
      <GridView notebooks={data} allowFilter />
    ) : (
      <DetailsView notebooks={data} allowFilter />
    );
  }

  const { favorites, others } = displayState.data as NotebookCategorized;

  return (
    <>
      {favorites.length > 0 && (
        <section className="mb-5">
          <h2 className="font-thin uppercase mb-3 tracking-wider">
            {translation("favorites")}
          </h2>
          {view === "grid" ? (
            <GridView notebooks={favorites} />
          ) : (
            <DetailsView notebooks={favorites} />
          )}
        </section>
      )}

      {others.length > 0 && (
        <section className="mb-5">
          <h2 className="font-thin uppercase mb-3 tracking-wider">
            {translation("others")}
          </h2>
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
  const tSForm = useTranslations("SearchForm");
  const tCommon = useTranslations("Common.terms");
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const displayState = useMemo(
    () => getDisplayState(notebooks.favorites, notebooks.others, term),
    [term, notebooks.favorites, notebooks.others]
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
          id="search-dashboard"
          className_input="h-8.5"
          aria-label={tSForm("placeholder.notebooks")}
          placeholder={tSForm("placeholder.notebooks")}
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

      {displayState.isEmpty ? (
        <p className="text-muted-foreground text-center py-8">
          {displayState.isSearching
            ? tSForm("state.noMatchMessage", {
                term: tCommon("notebook", { count: 2 }),
              })
            : tSForm("state.notFoundMessage", {
                term: tCommon("notebook", { count: 2 }),
              })}
        </p>
      ) : (
        renderContent(displayState, view, tCommon)
      )}
    </>
  );
};

export default Notebooks;
