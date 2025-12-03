"use server";

import { Notebook } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { isUserAuthed } from "@/server/auth";

import {
  getCachedNotebookById,
  getCachedNotebooks,
  getCachedTrashedNotebooks,
} from "@/lib/cache/notebooks";
import {
  createNotebookInDB,
  deleteNotebookFromDB,
  setNotebookFavoriteInDB,
  updateNotebookDeletedAt,
  updateNotebookInDB,
} from "@/lib/db/notebooks";

export const getCachedNotebooksAction = async () => {
  const userId = await isUserAuthed();
  return getCachedNotebooks(userId);
};

export const getCachedTrashedNotebooksAction = async () => {
  const userId = await isUserAuthed();
  return getCachedTrashedNotebooks(userId);
};

export const getCachedNotebookByIdAction = async (notebookId: string) => {
  const userId = await isUserAuthed();
  return getCachedNotebookById(notebookId, userId);
};

export const createNotebookAction = async (name: string) => {
  const userId = await isUserAuthed();
  const result = await createNotebookInDB(name, userId);

  revalidateTag(`notebooks-user-${userId}`);
  revalidatePath("/dashboard");

  return result;
};

export const updateNotebookAction = async (
  id: string,
  data: Partial<Notebook>
) => {
  const userId = await isUserAuthed();
  const result = await updateNotebookInDB(id, userId, data);

  revalidateTag(`notebook-${id}-${userId}`);
  revalidateTag(`notebooks-user-${userId}`);
  revalidatePath("/dashboard");

  return result;
};

export const trashNotebookAction = async (notebookId: string) => {
  const userId = await isUserAuthed();
  const result = await updateNotebookDeletedAt(notebookId, userId, new Date());

  revalidateTag(`notebook-${notebookId}-${userId}`);
  revalidateTag(`notebooks-user-${userId}`);
  revalidateTag(`trashed-notebooks-user-${userId}`);
  revalidatePath("/dashboard", "layout");

  return result;
};

export const restoreNotebookAction = async (notebookId: string) => {
  const userId = await isUserAuthed();
  const result = await updateNotebookDeletedAt(notebookId, userId, null);

  revalidateTag(`notebook-${notebookId}-${userId}`);
  revalidateTag(`notebooks-user-${userId}`);
  revalidateTag(`trashed-notebooks-user-${userId}`);
  revalidatePath("/dashboard", "layout");

  return result;
};

export const deleteNotebookAction = async (notebookId: string) => {
  const userId = await isUserAuthed();
  const result = await deleteNotebookFromDB(notebookId, userId);

  revalidateTag(`trashed-notebooks-user-${userId}`);
  revalidateTag(`trashed-notes-user-${userId}`);
  revalidateTag(`notebooks-user-${userId}`);
  revalidatePath("/dashboard");

  return result;
};

export const setNotebookFavoriteAction = async (
  id: string,
  isFavorite: boolean
) => {
  const userId = await isUserAuthed();

  const result = await setNotebookFavoriteInDB(id, userId, isFavorite);

  revalidateTag(`notebook-${id}-${userId}`);
  revalidateTag(`notebooks-user-${userId}`);
  revalidatePath("/dashboard");

  return result;
};
