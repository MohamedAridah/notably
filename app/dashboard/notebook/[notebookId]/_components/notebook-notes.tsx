"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { type Note } from "@prisma/client";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import GridView from "./notebook-notes-grid";
import { Grid2X2Icon, Rows3Icon } from "lucide-react";
import TableSkeketon from "@/components/(skeletons)/table";
const DetailsView = dynamic(() => import("./notebook-notes-details"), {
  ssr: false,
  loading: () => <TableSkeketon />,
});

const NotebookNotes = ({ notes }: { notes: Note[] }) => {
  const [view, setView] = useQueryState("view", { defaultValue: "grid" });

  const isActive = useCallback(
    (value: "grid" | "rows") =>
      clsx("hover:text-blue-600", view === value && "text-blue-500"),
    [view]
  );

  return (
    <>
      <div className="flex justify-end items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView("grid")}
          className={isActive("grid")}
        >
          <Grid2X2Icon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView("rows")}
          className={isActive("rows")}
        >
          <Rows3Icon className="size-5" />
        </Button>
      </div>
      {view == "grid" && <GridView notes={notes} />}
      {view == "rows" && <DetailsView notes={notes} />}
    </>
  );
};

export default NotebookNotes;
