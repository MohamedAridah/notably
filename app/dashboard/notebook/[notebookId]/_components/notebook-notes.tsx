"use client";

import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { type Note } from "@prisma/client";
import GridView from "./notebook-notes-grid";
import TableSkeketon from "@/components/(skeletons)/table";
import ViewController, {
  DEFAULT_VIEW,
} from "@/app/dashboard/_components/view-controller";
const DetailsView = dynamic(() => import("./notebook-notes-details"), {
  ssr: false,
  loading: () => <TableSkeketon />,
});

export type NoteScoped = Pick<
  Note,
  "id" | "notebookId" | "title" | "isFavorite"
> & {
  createdAt?: Date;
};

const NotebookNotes = ({ notes }: { notes: NoteScoped[] }) => {
  const [view] = useQueryState("view", { defaultValue: DEFAULT_VIEW });

  return (
    <>
      <ViewController />
      {view == "grid" && <GridView notes={notes} />}
      {view == "rows" && <DetailsView notes={notes} />}
    </>
  );
};

export default NotebookNotes;
