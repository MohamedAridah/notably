"use client";

import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { type Note } from "@prisma/client";
import GridView from "./notebook-notes-grid";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, {
  DEFAULT_VIEW,
} from "@/app/dashboard/_components/view-controller";
import { Search } from "@/components/(sidebar)/search";
import { useMemo } from "react";
const DetailsView = dynamic(() => import("./notebook-notes-details"), {
  ssr: false,
  loading: () => <TableSkeketon />,
});

export type NoteScoped = Pick<
  Note,
  "id" | "notebookId" | "title" | "isFavorite"
> & {
  createdAt?: Date;
};

const NotebookNotes = ({ notes }: { notes: NoteScoped[] }) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });
  const [term] = useQueryState("q", { defaultValue: "" });

  const filteredData = useMemo(() => {
    const s = term.toLowerCase();
    return notes.filter((item) => {
      const noteMatches = item.title?.toLowerCase().includes(s);
      return noteMatches;
    });
  }, [term]);

  const resultText = filteredData.length > 1 ? "results" : "result";

  return (
    <>
      <div className={`flex gap-2 items-center ${!term ? "mb-4" : ""}`}>
        <Search
          query="q"
          id="search-notebook-notes"
          placeholder="Search notes in this notebook..."
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
          {view == "grid" && <GridView notes={notes} />}
          {view == "rows" && <DetailsView notes={notes} />}
        </>
      ) : (
        <>
          {view == "grid" && <GridView notes={filteredData} />}
          {view == "rows" && <DetailsView notes={filteredData} />}
        </>
      )}
    </>
  );
};

export default NotebookNotes;
