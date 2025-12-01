import { unstable_cache } from "next/cache";
import {
  getNotebooksFromDB,
  getTrashedNotebooksFromDB,
  getNotebookByIdFromDB,
} from "@/lib/db/notebooks";

/**
 * Cache active notebooks for a user
 * Tag: notebooks-user-${userId}
 * Used in: Dashboard page
 */
export const getCachedNotebooks = (userId: string) => {
  console.log("Cache layer: getCachedNotebooks for user:", userId);

  return unstable_cache(
    async () => getNotebooksFromDB(userId),
    [`notebooks-user-${userId}`],
    {
      tags: [`notebooks-user-${userId}`],
    }
  )();
};

/**
 * Cache trashed notebooks for a user
 * Tag: trashed-notebooks-user-${userId}
 * Used in: Trash page
 */
export const getCachedTrashedNotebooks = (userId: string) => {
  console.log("Cache layer: getCachedTrashedNotebooks for user:", userId);

  return unstable_cache(
    async () => getTrashedNotebooksFromDB(userId),
    [`trashed-notebooks-user-${userId}`],
    {
      tags: [`trashed-notebooks-user-${userId}`],
    }
  )();
};

/**
 * Cache specific notebook by ID with its notes
 * Tag: notebook-${id}-${userId}
 * Used in: Notebook detail page
 */
export const getCachedNotebookById = (id: string, userId: string) => {
  console.log("Cache layer: getCachedNotebookById:", { id, userId });

  return unstable_cache(
    async () => getNotebookByIdFromDB(id, userId),
    [`notebook-${id}-${userId}`],
    {
      tags: [`notebook-${id}-${userId}`],
    }
  )();
};
