"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditNoteDialog from "@/components/(notes)/edit-note-button";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import IconMenu from "@/components/utils/icon-menu";
import {
  MoreHorizontalIcon,
  ExternalLinkIcon,
  PenSquareIcon,
  Trash2,
} from "lucide-react";
import FavoriteButton from "../utils/favorite-button";
import { handleToggleFavorite_Note } from "@/lib/utils";

interface NoteOptionsProps {
  noteId: string;
  notebookId: string;
  noteTitle?: string | null;
  notebook_url: string;
  note_url: string;
  isFavorite?: boolean;
}

export default function NoteOptions({
  note,
  alignStart = false,
}: {
  note: NoteOptionsProps;
  alignStart?: boolean;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="hover:cursor-pointer">
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">Open note options menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`pointer-events-auto ${alignStart ? "mr-3" : ""}`}
        >
          <DropdownMenuItem>
            <Link href={note.note_url}>
              <IconMenu
                text="Details"
                icon={<ExternalLinkIcon className="size-4" />}
              />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <FavoriteButton
              isFavorite={note.isFavorite as boolean}
              id={note.noteId}
              onToggle={handleToggleFavorite_Note}
              iconStyles="size-3.5"
              withText
            />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <IconMenu
              text="Update"
              icon={<PenSquareIcon className="size-4" />}
            />
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

      <EditNoteDialog
        noteId={note.noteId}
        note={{ title: note.noteTitle }}
        withTrigger={false}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />

      <DeleteNoteDialog
        noteId={note.noteId}
        withTrigger={false}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        callbackURL={note.notebook_url}
      />
    </>
  );
}
