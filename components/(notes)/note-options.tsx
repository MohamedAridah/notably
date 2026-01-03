"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { setNoteFavoriteAction } from "@/server/notes";
import { copyToClipboard } from "@/helpers/copy-to-clipboard";
import {
  NoteCardMode,
  NoteModePolicies,
} from "@/components/(notes)/note-mode-policies";
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
import MoveNoteDialog from "@/components/(notes)/move-note-button";
import RestoreNoteDialog from "@/components/(notes)/restore-note-button";
import DuplicateNoteButton from "@/components/(notes)/duplicate-note-button";
import { useTranslations } from "next-intl";
import {
  MoreHorizontalIcon,
  MoveUpRightIcon,
  PenSquareIcon,
  Trash2,
  Undo2,
  CornerUpRightIcon,
  LinkIcon,
} from "lucide-react";

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
  mode?: NoteCardMode;
}

export default function NoteOptions({
  note,
  mode = "default",
  ...props
}: NoteOptionsProps) {
  const t = useTranslations("NoteOptionsMenu");
  const tActions = useTranslations("Common.actions");
  const tClipboard = useTranslations("Clipboard");
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
          <span className="sr-only">{t("triggerAriaLabel")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`pointer-events-auto min-w-50`}>
          {policy.canView && (
            <DropdownMenuItem>
              <Link href={note.note_url} className="w-full">
                <IconMenu
                  text={tActions("details")}
                  icon={<MoveUpRightIcon className="size-4" />}
                />
              </Link>
            </DropdownMenuItem>
          )}

          {policy.canCopyLink && (
            <DropdownMenuItem>
              <IconMenu
                text={tActions("copy-link")}
                icon={<LinkIcon className="size-4" />}
                onClick={async () =>
                  await copyToClipboard(
                    process.env.NEXT_PUBLIC_BASE_URL + note.note_url,
                    tClipboard
                  )
                }
              />
            </DropdownMenuItem>
          )}

          {policy.canDuplicate && (
            <DropdownMenuItem>
              <DuplicateNoteButton
                noteId={note.noteId}
                notebook_url={note.notebook_url}
              />
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
                text={tActions("rename")}
                icon={<PenSquareIcon className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          {policy.canEdit && (
            <DropdownMenuItem onSelect={() => setIsMoveDialogOpen(true)}>
              <IconMenu
                text={tActions("move__to__notebook")}
                icon={<CornerUpRightIcon className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          {policy.canRestore && (
            <DropdownMenuItem onSelect={() => setIsRestoreDialogOpen(true)}>
              <IconMenu
                text={tActions("restore")}
                icon={<Undo2 className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <IconMenu
              className="text-red-500"
              text={tActions("delete")}
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
        mode={mode === "default" ? "move-to-trash" : "delete-permanently"}
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
