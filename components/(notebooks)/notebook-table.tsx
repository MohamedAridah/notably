import Link from "next/link";
import dynamic from "next/dynamic";
import { NotebookWithCountAndNotes } from "@/types/types";
import { setNotebookFavoriteAction } from "@/server/notebooks";
import { ResponsiveGridTable } from "@/components/utils/responsive-grid-table";
import {
  NotebookCardMode,
  NotebookModePolicies,
} from "@/components/(notebooks)/notebook-mode-policies";
import FavoriteButton from "@/components/utils/favorite-button";
const NotebookOptions = dynamic(
  () => import("@/components/(notebooks)/notebook-options"),
  { ssr: false }
);

interface NotebookTableProps {
  notebooks: NotebookWithCountAndNotes[];
  mode: NotebookCardMode;
  allowFilter?: boolean;
  showHeader?: boolean;
}

export default function NotebookTable({
  notebooks,
  mode,
  allowFilter,
  showHeader,
}: NotebookTableProps) {
  const policy = NotebookModePolicies[mode];
  const columns = [
    {
      key: "name",
      label: "Notebook Name",
      className: "col-span-5 max-md:col-span-4",
    },
    {
      key: "notes",
      label: "Sub Notes",
      className: "col-span-3",
    },
    {
      key: "date",
      label: mode === "default" ? "Created" : "Deleted",
      className: "col-span-3 max-md:col-span-2",
    },
    {
      key: "options",
      label: "",
      span: 1,
      className: "text-right col-span-1 max-md:col-span-3",
    },
  ];

  return (
    <ResponsiveGridTable
      columns={columns}
      showHeader={showHeader}
      allowFilter={allowFilter}
      data={notebooks}
      rowKey={(n) => n.id}
      renderCell={(notebook, column) => {
        switch (column.key) {
          case "name":
            return (
              <div className="flex items-center gap-1.5 overflow-hidden">
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
                    className="truncate pr-3 hover:underline underline-offset-3"
                  >
                    {notebook.name}
                  </Link>
                ) : (
                  <span className="truncate pr-3">{notebook.name}</span>
                )}
              </div>
            );

          case "notes":
            return `${notebook._count.notes} notes`;

          case "date":
            return new Date(
              notebook.deletedAt ?? notebook.createdAt
            ).toDateString();

          case "options":
            return (
              <NotebookOptions notebook={notebook} alignStart mode={mode} />
            );
        }
      }}
    />
  );
}
