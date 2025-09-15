"use client";

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
  PlusIcon,
  PenSquare,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

interface NotebookOptionsProps extends React.ComponentProps<"div"> {
  notebook: Pick<Notebook, "id" | "name">;
}

export default function NotebookOptions({
  notebook,
  ...props
}: NotebookOptionsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div {...props}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="hover:cursor-pointer">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open note options menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href={`/dashboard/notebook/${notebook.id}`}>
              <IconMenu
                text="Details"
                icon={<ExternalLinkIcon className="size-4" />}
              />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setIsCreateDialogOpen(true)}>
            <IconMenu
              text="Create Note"
              icon={<PlusIcon className="size-4" />}
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <IconMenu text="Update" icon={<PenSquare className="size-4" />} />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <IconMenu text="Delete" icon={<Trash2 className="size-4" />} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateNoteDialog
        notebookId={notebook.id}
        withTrigger={false}
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
      />

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
