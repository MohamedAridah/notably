import { Note, Notebook } from "@prisma/client";

type NotebookWithNotesResponse = {
  success: boolean;
  message?: string;
  notebooks: (NotebookWithNotes & NotebookWithCount) | null;
};

type TrashedNotebooksResponse = {
  success: boolean;
  message?: string;
  notebooks: NotebookWithCount[] | null;
};

type NotebookWithCountAndNotes = NonNullable<
  NotebookWithNotesResponse["notebooks"]
>;

type NotebookWithCount = Notebook & { _count: { notes: number } };

type NotebookWithNotes = Notebook & {
  notes: Array<{ id: string; title: string | null; isFavorite: boolean }>;
};

type NoteCardDefault = Omit<
  Note,
  "content" | "updatedAt" | "createdAt" | "userId" | "deletedAt"
>;

type NoteCardTrashed = Pick<Note, "deletedAt"|'createdAt'> & {
  notebook?: { name: string };
};

type NotebookByIdResponseNotes = {
  title: string | null;
  id: string;
  createdAt: Date;
  isFavorite: boolean;
  deletedAt: Date | null;
  notebookId: string | null;
};
