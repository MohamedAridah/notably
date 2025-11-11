"use client";

import { cn } from "@/lib/utils";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import { sidebarMenuButtonVariants } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AddNoteIcon() {
  const trigger = (
    <div className="group-data-[collapsible=icon]:inline-flex hidden hover:cursor-pointer">
      <CreateNoteDialog
        className={cn(sidebarMenuButtonVariants({}), "w-full h-auto")}
        classNameAsIocn=""
        asIcon
      />
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        Create Note
      </TooltipContent>
    </Tooltip>
  );
}
