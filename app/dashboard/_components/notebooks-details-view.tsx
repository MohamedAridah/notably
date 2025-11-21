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
import { setNotebookFavorite } from "@/server/notebooks";
const NotebookOptions = dynamic(
  () => import("@/components/(notebooks)/notebook-options"),
  { ssr: false }
);

export interface NotebookWithCount extends Notebook {
  _count: {
    notes: number;
  };
}

type Props = { notebooks: NotebookWithCount[] };

const DetailsView = ({ notebooks }: Props) => {
  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-5/12">Notebook Name</TableHead>
          <TableHead className="w-3/12">Sub Notes</TableHead>
          <TableHead className="w-3/12">Date</TableHead>
          <TableHead className="text-right w-1/12 max-sm:w-3/12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notebooks.map((notebook) => (
          <TableRow key={notebook.name}>
            <TableCell
              className="flex items-center gap-1.5"
              title={notebook.name}
            >
              <FavoriteButton
                isFavorite={notebook.isFavorite}
                id={notebook.id}
                onToggle={setNotebookFavorite}
                iconStyles="size-3.5"
              />
              <Link
                href={`/dashboard/notebook/${notebook.id}`}
                className="truncate pr-3 hover:underline"
              >
                {notebook.name}
              </Link>
            </TableCell>
            <TableCell>{notebook._count.notes} notes</TableCell>
            <TableCell>{new Date(notebook.createdAt).toDateString()}</TableCell>
            <TableCell className="text-right">
              <NotebookOptions notebook={notebook} alignStart />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DetailsView;
