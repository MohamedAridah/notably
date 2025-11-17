"use client";

import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { NotebookWithNotes } from "@/components/(notebooks)/notebook";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, { DEFAULT_VIEW } from "./view-controller";
import GridView from "./notebooks-grid-view";
import { Search } from "@/components/(sidebar)/search";
import { useMemo } from "react";
const DetailsView = dynamic(() => import("./notebooks-details-view"), {
  ssr: false,
  loading: () => <TableSkeketon />,
});

type NotebooksProps = {
  notebooks: {
    notebook__favorites: NotebookWithNotes[];
    notebook__others: NotebookWithNotes[];
  };
};

const Notebooks = ({ notebooks }: NotebooksProps) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const filteredData = useMemo(() => {
    const s = term.toLowerCase();
    return [
      ...notebooks.notebook__favorites,
      ...notebooks.notebook__others,
    ].filter((item) => {
      const notebookMatches = item.name.toLowerCase().includes(s);
      const noteMatches = item.notes.some((note) =>
        note.title?.toLowerCase().includes(s)
      );
      return notebookMatches || noteMatches;
    });
  }, [term]);

  const resultText = filteredData.length > 1 ? "results" : "result";

  return (
    <>
      <div className={`flex gap-2 items-center ${!term ? "mb-4" : ""}`}>
        <Search
          query="q"
          id="search-dashboard"
          placeholder="Search your notebooks..."
        />
        <ViewController />
      </div>

      {term ? (
        <p className="mb-4">
          {filteredData.length === 0
            ? "There are no data that matches "
            : `Showing ${filteredData.length} ${resultText} for `}
          <span className="font-bold">&quot;{term}&quot;</span>
        </p>
      ) : null}

      {filteredData.length > 1 && !term ? (
        <>
          {view == "grid" && (
            <>
              {notebooks.notebook__favorites.length > 0 ? (
                <div className="mb-5">
                  <h2 className="font-thin uppercase mb-3 tracking-wider ">
                    Favorites
                  </h2>
                  <GridView notebooks={notebooks.notebook__favorites} />
                </div>
              ) : null}

              {notebooks.notebook__others.length > 0 ? (
                <div className="mb-5">
                  <h2 className="font-thin uppercase mb-3 tracking-wider">
                    Others
                  </h2>
                  <GridView notebooks={notebooks.notebook__others} />
                </div>
              ) : null}
            </>
          )}
          {view == "rows" && (
            <>
              {notebooks.notebook__favorites ? (
                <div className="mb-5">
                  <h2 className="font-thin uppercase mb-3 tracking-wider">
                    Favorites
                  </h2>
                  <DetailsView
                    notebooks={
                      notebooks.notebook__favorites as NotebookWithNotes[]
                    }
                  />
                </div>
              ) : null}

              {notebooks.notebook__others ? (
                <div className="mb-5">
                  <h2 className="font-thin uppercase mb-3 tracking-wider">
                    Others
                  </h2>
                  <DetailsView
                    notebooks={
                      notebooks.notebook__others as NotebookWithNotes[]
                    }
                  />
                </div>
              ) : null}
            </>
          )}
        </>
      ) : (
        <>
          {view == "grid" && (
            <>
              {filteredData.length > 0 ? (
                <div className="mb-5">
                  <GridView notebooks={filteredData} />
                </div>
              ) : null}
            </>
          )}
          {view == "rows" && (
            <>
              {filteredData.length > 0 ? (
                <div className="mb-5">
                  <DetailsView
                    notebooks={filteredData as NotebookWithNotes[]}
                  />
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Notebooks;
