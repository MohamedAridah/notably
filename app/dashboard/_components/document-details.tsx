import { formatDate } from "@/app/(settings)/_components/utils/utils";
import { cn } from "@/lib/utils";
import { Note, Notebook } from "@prisma/client";
import React from "react";

type DocumentDetailsProps = {
  document: Notebook | Note;
};

export default function DocumentDetails({
  document,
  ...props
}: DocumentDetailsProps & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2 mt-2", props.className)}>
      <p className="text-sm">
        Created at:{" "}
        <span>
          {formatDate({
            date: document.createdAt,
          })}
        </span>
      </p>
      <p className="text-sm">
        Last updated at:{" "}
        <span>
          {formatDate({
            date: document.updatedAt,
          })}
        </span>
      </p>
    </div>
  );
}
