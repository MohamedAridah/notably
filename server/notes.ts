"use server";

import { Note, Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { isUserAuthed } from "@/server/auth";
import { getCachedNoteById, getCachedTrashedNotes } from "@/lib/cache/notes";
import {
  createNoteInDB,
  duplicateNoteInDB,
  deleteEmptyNotesFromDB,
  deleteNoteFromDB,
  trashNoteInDB,
  restoreNoteInDB,
  setNoteFavoriteInDB,
  updateNoteInDB,
} from "@/lib/db/notes";

/**
 * Get cached note by ID
 */
export const getCachedNoteByIdAction = async (noteId: string) => {
  const userId = await isUserAuthed();
  return getCachedNoteById(noteId, userId);
};

/**
 * Get cached trashed notes
 */
export const getCachedTrashedNotesAction = async () => {
  const userId = await isUserAuthed();
  return getCachedTrashedNotes(userId);
};

/**
 * Create new note
 */
export const createNoteAction = async (
  notebookId?: string,
  title?: Note["title"],
  content?: Prisma.InputJsonValue
) => {
  const userId = await isUserAuthed();
  const result = await createNoteInDB(userId, title, content, notebookId);

  if (result.success) {
    revalidateTag(`notebooks-user-${userId}`);
    revalidateTag(`notebook-${result.notebookId}-${userId}`);
    revalidatePath("/dashboard");
  }

  return result;
};

/**
 * Duplicate existed note
 */
export const duplicateNoteAction = async (noteId: string) => {
  const userId = await isUserAuthed();
  const result = await duplicateNoteInDB(userId, noteId);

  if (result.success) {
    revalidateTag(`notebooks-user-${userId}`);
    revalidateTag(`notebook-${result.notebookId}-${userId}`);
    revalidatePath("/dashboard");
  }
  
  return result;
};

/**
 * Update existing note
 */
export const updateNoteAction = async (id: string, data: Partial<Note>) => {
  const userId = await isUserAuthed();
  const result = await updateNoteInDB(id, userId, data);

  if (result.success) {
    revalidateTag(`note-${id}-${userId}`);
    revalidateTag(`notebooks-user-${userId}`);
    if (result.notebookId) {
      revalidateTag(`notebook-${result.notebookId}-${userId}`);
    }
    revalidatePath("/dashboard", "layout");
  }

  return result;
};

/**
 * Move note to trash
 */
export const trashNoteAction = async (noteId: string) => {
  const userId = await isUserAuthed();
  const result = await trashNoteInDB(noteId, userId);

  if (result.success) {
    revalidateTag(`note-${noteId}-${userId}`);
    revalidateTag(`trashed-notes-user-${userId}`);
    revalidateTag(`notebooks-user-${userId}`);
    revalidateTag(`notebook-${result.notebookId}-${userId}`);
    revalidatePath("/dashboard", "layout");
  }

  return result;
};

/**
 * Restore note from trash
 */
export const restoreNoteAction = async (noteId: string) => {
  const userId = await isUserAuthed();
  const result = await restoreNoteInDB(noteId, userId);

  if (result.success) {
    revalidateTag(`note-${noteId}-${userId}`);
    revalidateTag(`trashed-notes-user-${userId}`);
    revalidateTag(`notebooks-user-${userId}`);
    if (result.notebookId) {
      revalidateTag(`notebook-${result.notebookId}-${userId}`);
    }
    revalidatePath("/dashboard");
  }

  return result;
};

/**
 * Permanently delete note
 */
export const deleteNoteAction = async (noteId: string) => {
  const userId = await isUserAuthed();
  const result = await deleteNoteFromDB(noteId, userId);

  if (result.success) {
    revalidateTag(`note-${noteId}-${userId}`);
    revalidateTag(`trashed-notes-user-${userId}`);
    revalidateTag(`notebooks-user-${userId}`);
    if (result.notebookId) {
      revalidateTag(`notebook-${result.notebookId}-${userId}`);
    }
    revalidatePath("/dashboard");
  }

  return result;
};

/**
 * Toggle note favorite status
 */
export const setNoteFavoriteAction = async (
  id: string,
  isFavorite: boolean
) => {
  const userId = await isUserAuthed();
  const result = await setNoteFavoriteInDB(id, userId, isFavorite);

  if (result.success) {
    revalidateTag(`note-${id}-${userId}`);
    revalidateTag(`notebooks-user-${userId}`);
    if (result.notebookId) {
      revalidateTag(`notebook-${result.notebookId}-${userId}`);
    }
    revalidatePath("/dashboard");
  }

  return result;
};

/**
 * Delete all empty notes for user
 */
export const deleteEmptyNotesAction = async () => {
  const userId = await isUserAuthed();
  const result = await deleteEmptyNotesFromDB(userId);

  if (result.success) {
    revalidateTag(`trashed-notes-user-${userId}`);
    revalidateTag(`notebooks-user-${userId}`);
    revalidatePath("/dashboard", "layout");
  }

  return result;
};
