"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarMenuButtonVariants } from "@/components/ui/sidebar";
import CreateNotebookDialog from "../(notebooks)/create-notebook-button";
import { NotebookIcon } from "lucide-react";

export default function AddNotebookIcon() {
  const trigger = (
    <div className="group-data-[collapsible=icon]:inline-flex hidden hover:cursor-pointer">
      <CreateNotebookDialog
        className={cn(sidebarMenuButtonVariants({}))}
        classNameAsIocn=""
        asIcon
        icon={NotebookIcon}
      />
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        Create Notebook
      </TooltipContent>
    </Tooltip>
  );
}
