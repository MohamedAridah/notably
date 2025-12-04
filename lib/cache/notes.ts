"use server";

import { unstable_cache } from "next/cache";
import { getNoteByIdFromDB, getTrashedNotesFromDB } from "@/lib/db/notes";

/**
 * Cache note by ID for a specific user
 * Tag: note-${id}-${userId}
 * Used in: Note editor page
 */
export const getCachedNoteById = async(id: string, userId: string) => {
  console.log("Cache layer: getCachedNoteById:", { id, userId });

  return unstable_cache(
    async () => getNoteByIdFromDB(id, userId),
    [`note-${id}-${userId}`],
    {
      tags: [`note-${id}-${userId}`],
    }
  )();
};

/**
 * Cache trashed notes for a user
 * Tag: trashed-notes-user-${userId}
 * Used in: Trash page
 */
export const getCachedTrashedNotes = async(userId: string) => {
  console.log("Cache layer: getCachedTrashedNotes for user:", userId);

  return unstable_cache(
    async () => getTrashedNotesFromDB(userId),
    [`trashed-notes-user-${userId}`],
    {
      tags: [`trashed-notes-user-${userId}`],
    }
  )();
};
