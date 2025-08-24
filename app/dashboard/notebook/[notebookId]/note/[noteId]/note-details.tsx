import { Note } from "@prisma/client";
import { Fragment } from "react";

export default function NoteDetails({ note }: { note: Partial<Note> }) {
  return (
    <Fragment>
      <p className="text-sm">
        Created at:{" "}
        <span>{new Date(note?.createdAt as Date).toDateString()}</span>
      </p>
      <p className="text-sm">
        Last updated at:{" "}
        <span>{new Date(note?.updatedAt as Date).toDateString()}</span>
      </p>
    </Fragment>
  );
}
