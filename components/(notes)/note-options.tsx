"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
import FavoriteButton from "@/components/utils/favorite-button";
import MoveNoteDialog from "./move-note-button";
import {
  MoreHorizontalIcon,
  ExternalLinkIcon,
  PenSquareIcon,
  Trash2,
  ReplaceIcon,
  RotateCwIcon,
} from "lucide-react";
import { setNoteFavoriteAction } from "@/server/notes";
import { NoteCardMode, NoteModePolicies } from "./note-mode-policies";
import RestoreNoteDialog from "./restore-note-button";

interface NoteOptionsProps {
  note: {
    noteId: string;
    notebookId: string;
    noteTitle?: string | null;
    notebook_url: string;
    note_url: string;
    isFavorite?: boolean;
  };
}

interface NoteOptionsProps extends React.ComponentProps<"div"> {
  note: NoteOptionsProps["note"];
  alignStart?: boolean;
  mode?: NoteCardMode;
}

export default function NoteOptions({
  note,
  alignStart = false,
  mode = "default",
  ...props
}: NoteOptionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const policy = NoteModePolicies[mode];

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn("hover:cursor-pointer", props.className)}
        >
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">Open note options menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`pointer-events-auto ${alignStart ? "mr-3" : ""}`}
        >
          {policy.canView && (
            <DropdownMenuItem>
              <Link href={note.note_url}>
                <IconMenu
                  text="Details"
                  icon={<ExternalLinkIcon className="size-4" />}
                />
              </Link>
            </DropdownMenuItem>
          )}

          {policy.favoriteInteractive && (
            <DropdownMenuItem>
              <FavoriteButton
                isFavorite={note.isFavorite as boolean}
                id={note.noteId}
                onToggle={setNoteFavoriteAction}
                iconStyles="size-3.5"
                withText
              />
            </DropdownMenuItem>
          )}

          {policy.canEdit && (
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <IconMenu
                text="Update"
                icon={<PenSquareIcon className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          {policy.canEdit && (
            <DropdownMenuItem onSelect={() => setIsMoveDialogOpen(true)}>
              <IconMenu
                text="Move to notebook"
                icon={<ReplaceIcon className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          {policy.canRestore && (
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

      <EditNoteDialog
        noteId={note.noteId}
        note={{ title: note.noteTitle }}
        withTrigger={false}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />

      <MoveNoteDialog
        noteId={note.noteId}
        currentNotebookId={note.notebookId}
        withTrigger={false}
        isOpen={isMoveDialogOpen}
        setIsOpen={setIsMoveDialogOpen}
      />

      <DeleteNoteDialog
        noteId={note.noteId}
        withTrigger={false}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        callbackURL={note.notebook_url}
      />

      <RestoreNoteDialog
        noteId={note.noteId}
        withTrigger={false}
        isOpen={isRestoreDialogOpen}
        setIsOpen={setIsRestoreDialogOpen}
      />
    </>
  );
}
