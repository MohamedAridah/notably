"use client";

import { cn } from "@/lib/utils";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import { sidebarMenuButtonVariants } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotepadTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AddNoteIcon() {
  const t = useTranslations("CreateNoteButton");

  const trigger = (
    <div className="group-data-[collapsible=icon]:inline-flex hidden hover:cursor-pointer">
      <CreateNoteDialog
        className={cn(sidebarMenuButtonVariants({}))}
        classNameAsIocn=""
        asIcon
        icon={NotepadTextIcon}
      />
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {t("labelLong")}
      </TooltipContent>
    </Tooltip>
  );
}
