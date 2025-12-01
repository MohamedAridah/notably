"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type Notebook } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "@/components/utils/icon-menu";
import DeleteNotebookDialog from "@/components/(notebooks)/delete-notebook-button";
import EditNotebookDialog from "@/components/(notebooks)/edit-notebook-button";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import {
  MoreHorizontal,
  ExternalLinkIcon,
  PenSquare,
  Trash2,
  RotateCwIcon,
} from "lucide-react";
import FavoriteButton from "../utils/favorite-button";
import { cn } from "@/lib/utils";
import { setNotebookFavoriteAction } from "@/server/notebooks";
import {
  NotebookCardMode,
  NotebookModePolicies,
} from "../(notebooks)/notebook-mode-policies";
import RestoreNotebookDialog from "./restore-notebook-button";

interface NotebookOptionsProps extends React.ComponentProps<"div"> {
  notebook: Pick<Notebook, "id" | "name" | "isFavorite">;
  alignStart?: boolean;
  mode?: NotebookCardMode;
}

export default function NotebookOptions({
  notebook,
  alignStart = false,
  mode = "default",
  ...props
}: NotebookOptionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const { canEdit, favoriteInteractive, canView, canRestore, canCreate } =
    NotebookModePolicies[mode];

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn("hover:cursor-pointer", props.className)}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open note options menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`pointer-events-auto ${alignStart ? "mr-3" : ""}`}
        >
          {canView && (
            <DropdownMenuItem>
              <Link href={`/dashboard/notebook/${notebook.id}`}>
                <IconMenu
                  text="Details"
                  icon={<ExternalLinkIcon className="size-4" />}
                />
              </Link>
            </DropdownMenuItem>
          )}

          {canCreate && (
            <DropdownMenuItem>
              <CreateNoteDialog notebookId={notebook.id} asLabel />
            </DropdownMenuItem>
          )}

          {favoriteInteractive && (
            <DropdownMenuItem>
              <FavoriteButton
                isFavorite={notebook.isFavorite}
                id={notebook.id}
                onToggle={setNotebookFavoriteAction}
                iconStyles="size-3.5"
                withText
                disabled={!favoriteInteractive}
              />
            </DropdownMenuItem>
          )}

          {canEdit && (
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <IconMenu text="Update" icon={<PenSquare className="size-4" />} />
            </DropdownMenuItem>
          )}

          {canRestore && (
            <DropdownMenuItem onSelect={() => setIsRestoreDialogOpen(true)}>
              <IconMenu
                text="Restore"
                icon={<RotateCwIcon className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <IconMenu
              className="text-red-500"
              text="Delete"
              icon={<Trash2 className="size-4 text-red-500" />}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditNotebookDialog
        notebookId={notebook.id}
        notebook={notebook}
        withTrigger={false}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />

      <DeleteNotebookDialog
        notebookId={notebook.id}
        notebookName={notebook.name}
        withTrigger={false}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        // callbackURL={mode === "default" ? "/dashboard" : undefined}
      />

      <RestoreNotebookDialog
        notebookId={notebook.id}
        notebookName={notebook.name}
        withTrigger={false}
        isOpen={isRestoreDialogOpen}
        setIsOpen={setIsRestoreDialogOpen}
      />
    </>
  );
}
