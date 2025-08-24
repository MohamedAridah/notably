"use client";

import Link from "next/link";
import { Ellipsis, ExternalLinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateNoteDialog from "@/components/(notes)/create-note-button";
import EditNoteDialog from "@/components/(notes)/edit-note-button";
import DeleteNoteDialog from "@/components/(notes)/delete-note-button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface NoteOptionsProps {
  noteId: string;
  notebookId: string;
  noteTitle?: string;
  notebook_url: string;
  note_url: string;
}

export default function NoteOptions({ note }: { note: NoteOptionsProps }) {
  return (
    <DropdownMenu>
      <Dialog>
        <DropdownMenuTrigger asChild className="hover:cursor-pointer">
          <DialogTrigger aria-label="Open note options menu">
            <Ellipsis className="size-4" />
            <span className="sr-only">Open note options menu</span>
          </DialogTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              className="flex items-center justify-between w-full"
              href={note.note_url}
            >
              Details <ExternalLinkIcon className="size-4" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0"
          >
            <CreateNoteDialog notebookId={note.notebookId} asLabel />
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0"
          >
            <EditNoteDialog
              noteId={note.noteId}
              note={{ title: note.noteTitle }}
              asLabel
            />
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0"
          >
            <DeleteNoteDialog
              noteId={note.noteId}
              asLabel
              callbackURL={note.notebook_url}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </Dialog>
    </DropdownMenu>
  );
}
