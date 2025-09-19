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
import { handleToggleFavorite_Notebook } from "@/lib/utils";
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Notebook Name</TableHead>
          <TableHead>Sub Notes</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notebooks.map((notebook) => (
          <TableRow key={notebook.name}>
            <TableCell className="font-medium flex items-center gap-1.5">
              <FavoriteButton
                isFavorite={notebook.isFavorite}
                id={notebook.id}
                onToggle={handleToggleFavorite_Notebook}
                iconStyles="size-3.5"
              />
              <Link
                href={`/dashboard/notebook/${notebook.id}`}
                className="hover:underline"
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
