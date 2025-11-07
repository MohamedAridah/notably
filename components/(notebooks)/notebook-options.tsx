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
} from "lucide-react";
import FavoriteButton from "../utils/favorite-button";
import { handleToggleFavorite_Notebook } from "@/lib/utils";

interface NotebookOptionsProps extends React.ComponentProps<"div"> {
  notebook: Pick<Notebook, "id" | "name" | "isFavorite">;
  alignStart?: boolean;
}

export default function NotebookOptions({
  notebook,
  alignStart = false,
  ...props
}: NotebookOptionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div {...props}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="hover:cursor-pointer">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open note options menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`pointer-events-auto ${alignStart ? "mr-3" : ""}`}
        >
          <DropdownMenuItem>
            <Link href={`/dashboard/notebook/${notebook.id}`}>
              <IconMenu
                text="Details"
                icon={<ExternalLinkIcon className="size-4" />}
              />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <CreateNoteDialog notebookId={notebook.id} asLabel />
          </DropdownMenuItem>

          <DropdownMenuItem>
            <FavoriteButton
              isFavorite={notebook.isFavorite}
              id={notebook.id}
              onToggle={handleToggleFavorite_Notebook}
              iconStyles="size-3.5"
              withText
            />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <IconMenu text="Update" icon={<PenSquare className="size-4" />} />
          </DropdownMenuItem>

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
        withTrigger={false}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </div>
  );
}
