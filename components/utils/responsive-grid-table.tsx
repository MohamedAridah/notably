"use client";

import { cn } from "@/lib/utils";
import { NoteCardDefault, NoteCardTrashed } from "@/types/types";
import NoteTable from "@/components/(notes)/note-table";

interface Column {
  key: string;
  label?: React.ReactNode;
  span?: number;
  className?: string;
}

interface ResponsiveGridTableProps {
  columns: Column[];
  showHeader?: boolean;
  allowFilter?: boolean;
  data: any[];
  rowKey: (row: any) => string | number;
  renderCell: (row: any, column: Column) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export function ResponsiveGridTable({
  columns,
  showHeader,
  allowFilter = false,
  data,
  rowKey,
  renderCell,
  className,
  headerClassName,
  rowClassName,
}: ResponsiveGridTableProps) {
  return (
    <div className={cn("w-full text-sm", className)}>
      {/* Header */}
      {showHeader && (
        <div
          className={cn(
            "grid grid-cols-12 border-b font-medium whitespace-nowrap h-10",
            headerClassName
          )}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              className={cn(
                col.span && `col-span-${col.span}`,
                "px-2 flex items-center",
                col.className
              )}
            >
              {col.label}
            </div>
          ))}
        </div>
      )}

      {/* Rows */}
      {data.map((row) => {
        const hasNestedNotes = row.notes && row.notes.length > 0;
        return (
          <div
            key={rowKey(row)}
            className="border-b last:border-b-0 whitespace-nowrap"
          >
            {/* Main row */}
            <div
              className={cn(
                "grid grid-cols-12 items-center hover:bg-muted/50",
                rowClassName
              )}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={cn(
                    col.span && `col-span-${col.span}`,
                    "p-2",
                    col.className
                  )}
                >
                  {renderCell(row, col)}
                </div>
              ))}
            </div>

            {hasNestedNotes && allowFilter && (
              <ul className="border-sidebar-border ms-8 flex flex-col gap-2 border-s ps-2.5 py-0.5 mb-5">
                {row.notes.map((note: NoteCardDefault & NoteCardTrashed) => (
                  <li className="relative ps-2" key={note.id}>
                    <div className="absolute h-4 w-[19px] top-1/4 start-[-10px] border-b-2 border-b-sidebar-border ltr:rounded-bl-lg rtl:rounded-br-lg"></div>
                    <NoteTable
                      notes={[
                        {
                          ...note,
                          notebookId: row.id,
                          notebook: { name: row.name },
                        },
                      ]}
                      mode="default"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
