import { useCallback } from "react";
import { useQueryState } from "nuqs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Grid2X2Icon, Rows3Icon } from "lucide-react";

export type Views = "grid" | "rows" | string;

export const DEFAULT_VIEW: Views = "grid";

export default function ViewController() {
  const [view, setView] = useQueryState("view", { defaultValue: DEFAULT_VIEW });

  const isActive = useCallback(
    (value: Views) =>
      clsx("hover:text-blue-600", view === value && "text-blue-500"),
    [view]
  );

  return (
    <div className="flex justify-end items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
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
        <TooltipTrigger asChild>
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
  );
}
