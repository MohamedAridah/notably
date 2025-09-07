"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import clsx from "clsx";
import { NotebookWithCount } from "@/components/(notebooks)/notebook";
import { Button } from "@/components/ui/button";
import GridView from "./notebooks-grid-view";
const DetailsView = dynamic(() => import("./notebooks-details-view"), {
  ssr: false,
  loading: () => <TableSkeketon />,
});
import { Grid2X2Icon, Rows3Icon } from "lucide-react";
import TableSkeketon from "@/components/(skeletons)/table";

const Notebooks = ({ notebooks }: { notebooks: NotebookWithCount[] }) => {
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
      {view == "grid" && (
        <GridView notebooks={notebooks as NotebookWithCount[]} />
      )}
      {view == "rows" && (
        <DetailsView notebooks={notebooks as NotebookWithCount[]} />
      )}
    </>
  );
};

export default Notebooks;
