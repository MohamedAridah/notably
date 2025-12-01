import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Notebook } from "@prisma/client";
import dynamic from "next/dynamic";
import FavoriteButton from "@/components/utils/favorite-button";
import { setNotebookFavoriteAction } from "@/server/notebooks";
import {
  NotebookCardMode,
  NotebookModePolicies,
} from "@/components/(notebooks)/notebook-mode-policies";
const NotebookOptions = dynamic(
  () => import("@/components/(notebooks)/notebook-options"),
  { ssr: false }
);

export interface NotebookWithCount extends Notebook {
  _count: {
    notes: number;
  };
}

type Props = {
  notebooks: NotebookWithCount[];
  mode?: NotebookCardMode;
};

const DetailsView = ({ notebooks, mode = "default" }: Props) => {
  const policy = NotebookModePolicies[mode];

  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-5/12">Notebook Name</TableHead>
          <TableHead className="w-3/12">Sub Notes</TableHead>
          {mode === "default" && (
            <TableHead className="w-3/12">Created</TableHead>
          )}
          {mode === "trash" && (
            <TableHead className="w-3/12">Deleted</TableHead>
          )}
          <TableHead className="text-right w-1/12 max-sm:w-3/12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notebooks.map((notebook) => (
          <TableRow key={notebook.name} className="group/notebook-buttons">
            <TableCell
              className="flex items-center gap-1.5"
              title={notebook.name}
            >
              {policy.canFavorite && (
                <FavoriteButton
                  isFavorite={notebook.isFavorite}
                  id={notebook.id}
                  onToggle={setNotebookFavoriteAction}
                  disabled={!policy.favoriteInteractive}
                  iconStyles="size-3.5"
                />
              )}

              {policy.canView ? (
                <Link
                  href={`/dashboard/notebook/${notebook.id}`}
                  className="truncate pr-3 hover:underline"
                >
                  {notebook.name}
                </Link>
              ) : (
                <span>{notebook.name}</span>
              )}
            </TableCell>

            <TableCell>{notebook._count.notes} notes</TableCell>

            {!notebook.deletedAt && (
              <TableCell>
                {new Date(notebook.createdAt).toDateString()}
              </TableCell>
            )}

            {notebook.deletedAt && (
              <TableCell>
                {new Date(notebook.deletedAt).toDateString()}
              </TableCell>
            )}

            <TableCell className="text-right ">
              <NotebookOptions notebook={notebook} alignStart mode={mode} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DetailsView;
