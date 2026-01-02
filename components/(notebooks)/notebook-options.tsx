"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type Notebook } from "@prisma/client";
import { setNotebookFavoriteAction } from "@/server/notebooks";
import { cn } from "@/lib/utils";
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
import FavoriteButton from "@/components/utils/favorite-button";
import RestoreNotebookDialog from "@/components/(notebooks)/restore-notebook-button";
import {
  NotebookCardMode,
  NotebookModePolicies,
} from "@/components/(notebooks)/notebook-mode-policies";
import {
  MoreHorizontal,
  MoveUpRightIcon,
  PenSquare,
  Trash2,
  Undo2,
  LinkIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/helpers/copy-to-clipboard";

interface NotebookOptionsProps extends React.ComponentProps<"div"> {
  notebook: Pick<Notebook, "id" | "name" | "isFavorite">;
  mode?: NotebookCardMode;
}

export default function NotebookOptions({
  notebook,
  mode = "default",
  ...props
}: NotebookOptionsProps) {
  const t = useTranslations("NotebookOptionsMenu");
  const actions = useTranslations("Common.actions");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const policy = NotebookModePolicies[mode];

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn("hover:cursor-pointer", props.className)}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{t("triggerAriaLabel")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`pointer-events-auto min-w-50`}>
          {policy.canView && (
            <DropdownMenuItem>
              <Link
                href={`/dashboard/notebook/${notebook.id}`}
                className="w-full"
              >
                <IconMenu
                  text={actions("details")}
                  icon={<MoveUpRightIcon className="size-4" />}
                />
              </Link>
            </DropdownMenuItem>
          )}

          {policy.canCopyLink && (
            <DropdownMenuItem>
              <IconMenu
                text={actions("copy-link")}
                icon={<LinkIcon className="size-4" />}
                onClick={async () =>
                  await copyToClipboard(
                    process.env.NEXT_PUBLIC_BASE_URL +
                      `/dashboard/notebook/${notebook.id}`
                  )
                }
              />
            </DropdownMenuItem>
          )}

          {policy.canCreate && (
            <DropdownMenuItem>
              <CreateNoteDialog notebookId={notebook.id} asLabel />
            </DropdownMenuItem>
          )}

          {policy.favoriteInteractive && (
            <DropdownMenuItem>
              <FavoriteButton
                isFavorite={notebook.isFavorite}
                id={notebook.id}
                onToggle={setNotebookFavoriteAction}
                iconStyles="size-3.5"
                withText
                disabled={!policy.favoriteInteractive}
              />
            </DropdownMenuItem>
          )}

          {policy.canEdit && (
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <IconMenu
                text={actions("rename")}
                icon={<PenSquare className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          {policy.canRestore && (
            <DropdownMenuItem onSelect={() => setIsRestoreDialogOpen(true)}>
              <IconMenu
                text={actions("restore")}
                icon={<Undo2 className="size-4" />}
              />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <IconMenu
              className="text-red-500"
              text={actions("delete")}
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
