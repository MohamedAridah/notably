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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type NotebooksProps = {
  notebooks: {
    notebook__favorites: NotebookWithCount[];
    notebook__others: NotebookWithCount[];
  };
};

const Notebooks = ({ notebooks }: NotebooksProps) => {
  const [view, setView] = useQueryState("view", { defaultValue: "grid" });

  const isActive = useCallback(
    (value: "grid" | "rows") =>
      clsx("hover:text-blue-600", view === value && "text-blue-500"),
    [view]
  );

  return (
    <>
      <div className="flex justify-end items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Show as Grid view"
              onClick={() => setView("grid")}
              className={isActive("grid")}
            >
              <Grid2X2Icon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Grid view</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Show as Table view"
              title="Show as Table view"
              onClick={() => setView("rows")}
              className={isActive("rows")}
            >
              <Rows3Icon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Table view</p>
          </TooltipContent>
        </Tooltip>
      </div>
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
                notebooks={notebooks.notebook__favorites as NotebookWithCount[]}
              />
            </div>
          ) : null}

          {notebooks.notebook__others ? (
            <div className="mb-5">
              <h2 className="font-thin uppercase mb-3 tracking-wider">
                Others
              </h2>
              <DetailsView
                notebooks={notebooks.notebook__others as NotebookWithCount[]}
              />
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default Notebooks;
