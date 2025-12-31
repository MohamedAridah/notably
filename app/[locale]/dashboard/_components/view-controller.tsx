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
import { useTranslations } from "next-intl";

export type Views = "grid" | "rows" | string;

export const DEFAULT_VIEW: Views = "grid";

export default function ViewController() {
  const t = useTranslations("ViewController");
  const [view, setView] = useQueryState("view", { defaultValue: DEFAULT_VIEW });

  const isActive = useCallback(
    (value: Views) =>
      clsx("hover:text-blue-600", view === value && "text-blue-500"),
    [view]
  );

  return (
    <div className="flex justify-end items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("gridViewAria")}
            onClick={() => setView("grid")}
            className={isActive("grid")}
          >
            <Grid2X2Icon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{t("gridViewTooltip")}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("tableViewAria")}
            onClick={() => setView("rows")}
            className={isActive("rows")}
          >
            <Rows3Icon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{t("tableViewTooltip")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
