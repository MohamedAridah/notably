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

interface NoteOptionsProps {
  noteId: string;
  notebookId: string;
  noteTitle?: string;
  notebook_url: string;
  note_url: string;
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
        <DropdownMenuContent className={alignStart ? "mr-3" : ""}>
          <DropdownMenuItem>
            <Link href={note.note_url}>
              <IconMenu
                text="Details"
                icon={<ExternalLinkIcon className="size-4" />}
              />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <IconMenu
              text="Update"
              icon={<PenSquareIcon className="size-4" />}
            />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <IconMenu text="Delete" icon={<Trash2 className="size-4" />} />
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
