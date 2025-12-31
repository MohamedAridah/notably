"use server";

import { ServerErrorCodes } from "@/helpers/server-error-codes";
import prisma from "@/lib/prisma";
import { Notebook } from "@prisma/client";

/**
 * Type definitions for different response shapes
 */
type NotebookWithNotesResponse = {
  success: boolean;
  code?: string;
  notebooks:
    | (Notebook & {
        notes: Array<{ id: string; title: string | null; isFavorite: boolean }>;
        _count: { notes: number };
      })[]
    | null;
};

type TrashedNotebooksResponse = {
  success: boolean;
  code?: string;
  notebooks: (Notebook & { _count: { notes: number } })[] | null;
};

export async function getNotebooksFromDB(
  userId: string
): Promise<NotebookWithNotesResponse> {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
      notebooks: null,
    };
  }

  console.log("DB Query: getNotebooksFromDB for user:", userId);

  try {
    const notebooks = await prisma.notebook.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        isDefault: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        deletedAt: true,
        _count: {
          select: {
            notes: true,
          },
        },
        notes: {
          select: {
            id: true,
            title: true,
            isFavorite: true,
            createdAt: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
      orderBy: [{ isDefault: "desc" }],
    });

    return {
      success: true,
      notebooks: notebooks as any,
    };
  } catch (error) {
    console.error("DB Error in getNotebooksFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_FETCH_NOTEBOOKS,
      notebooks: null,
    };
  }
}

/**
 * Get trashed notebooks for a user (soft deleted)
 * Used for: Trash page where users can restore or permanently delete
 * Note: Does NOT include notes (they're shown with their notebook)
 */
export async function getTrashedNotebooksFromDB(
  userId: string
): Promise<TrashedNotebooksResponse> {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
      notebooks: null,
    };
  }

  console.log("DB Query: getTrashedNotebooksFromDB for user:", userId);

  try {
    const notebooks = await prisma.notebook.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      select: {
        id: true,
        name: true,
        isDefault: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        deletedAt: true,
        _count: {
          select: {
            notes: true,
          },
        },
      },
      orderBy: [{ deletedAt: "desc" }, { createdAt: "desc" }],
    });

    return {
      success: true,
      notebooks: notebooks as any,
    };
  } catch (error) {
    console.error("DB Error in getTrashedNotebooksFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_FETCH_TRASH_NOTEBOOKS,
      notebooks: null,
    };
  }
}

/**
 * Get a specific notebook by ID with its notes
 * Used for: Notebook detail page
 */
export async function getNotebookByIdFromDB(id: string, userId: string) {
  if (!id || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_INVALID_ID,
      notebook: null,
    };
  }

  console.log("DB Query: getNotebookByIdFromDB:", { id, userId });

  try {
    const notebook = await prisma.notebook.findUnique({
      where: { id, userId },
      select: {
        id: true,
        name: true,
        isDefault: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        deletedAt: true,
        _count: {
          select: {
            notes: {
              where: { deletedAt: null },
            },
          },
        },
        notes: {
          select: {
            id: true,
            title: true,
            isFavorite: true,
            notebookId: true,
            createdAt: true,
            deletedAt: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!notebook) {
      return {
        success: false,
        code: ServerErrorCodes.NOTEBOOKS.ERROR_NOT_FOUND,
        notebook: null,
      };
    }

    return {
      success: true,
      notebook,
    };
  } catch (error) {
    console.error("DB Error in getNotebookByIdFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_FETCH_NOTEBOOK,
      notebook: null,
    };
  }
}

/**
 * Create new notebook
 */
export const createNotebookInDB = async (
  name: Notebook["name"],
  userId: string
) => {
  if (!name || name.trim().length === 0) {
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_NOT_FOUND,
    };
  }

  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: createNotebook:", { userId });

  try {
    const notebook = await prisma.notebook.create({
      data: {
        userId,
        name,
      },
    });

    return {
      success: true,
      notebookId: notebook.id,
      code: ServerErrorCodes.NOTEBOOKS.SUCCESS_CREATED,
    };
  } catch (error) {
    console.error("DB Error in createNotebook:", error);

    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_CREATION,
    };
  }
};

/**
 * Create Default notebook for solo notes
 */
export const createDefaultNotebook = async (userId: string) => {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: createDefaultNotebook:", { userId });

  try {
    await prisma.notebook.create({
      data: {
        userId,
        name: "Quick Notes",
        isDefault: true,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTEBOOKS.SUCCESS_QUICK_CREATED,
    };
  } catch (error) {
    console.error("DB Error in createDefaultNotebook:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_QUICK_CREATION,
    };
  }
};

/**
 * Update existed notebook
 */
export const updateNotebookInDB = async (
  id: string,
  userId: string,
  data: Partial<Notebook>
) => {
  if (!id) {
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_INVALID_ID,
    };
  }

  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: updateNotebook:", { userId });

  try {
    await prisma.notebook.updateMany({
      where: {
        id,
        userId,
      },
      data,
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTEBOOKS.SUCCESS_UPDATED,
    };
  } catch (error) {
    console.error("DB Error in updateNotebookInDB:", error);

    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_UPDATE,
    };
  }
};

/**
 * Move notebook to trash or restore notebook
 * @param deletedAt Date => to trash notebook
 * @param deletedAt null => to restore notebook
 */
export async function updateNotebookDeletedAt(
  notebookId: string,
  userId: string,
  deletedAt: Date | null
) {
  if (!notebookId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_INVALID_ID,
    };
  }

  if (!userId) {
    return { success: false, code: ServerErrorCodes.AUTH.INVALID_USER_ID };
  }

  console.log("DB Query: updateNotebookDeletedAt:", { userId });

  try {
    const [notebookResult] = await prisma.$transaction([
      prisma.notebook.updateMany({
        where: { id: notebookId, userId },
        data: { deletedAt },
      }),
      prisma.note.updateMany({
        where: { notebookId },
        data: { deletedAt },
      }),
    ]);

    if (notebookResult.count === 0) {
      return { success: false, code: ServerErrorCodes.NOTEBOOKS.ERROR_EMPTY };
    }

    return {
      success: true,
      code: deletedAt
        ? ServerErrorCodes.NOTEBOOKS.SUCCESS_MOVE_TO_TRASH
        : ServerErrorCodes.NOTEBOOKS.SUCCESS_RESTORE,
    };
  } catch (error) {
    console.error("DB Error in updateNotebookDeletedAt:", error);

    return {
      success: false,
      code: deletedAt
        ? ServerErrorCodes.NOTEBOOKS.ERROR_TRASH
        : ServerErrorCodes.NOTEBOOKS.ERROR_RESTORE,
    };
  }
}

/**
 * Delete notebook from database forever
 */
export const deleteNotebookFromDB = async (id: string, userId: string) => {
  if (!id) {
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_INVALID_ID,
    };
  }

  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }
  console.log("DB Query: deleteNotebookFromDB:", { userId });
  try {
    await prisma.notebook.delete({
      where: {
        userId,
        id,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTEBOOKS.SUCCESS_DELETE,
    };
  } catch (error) {
    console.error("DB Error in deleteNotebokkInDB:", error);

    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_DELETE,
    };
  }
};

/**
 * Toggle favorite option for notebook
 */
export const setNotebookFavoriteInDB = async (
  id: string,
  userId: string,
  isFavorite: boolean
) => {
  if (!id) {
    return {
      success: false,
      code: ServerErrorCodes.NOTEBOOKS.ERROR_INVALID_ID,
    };
  }

  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: setNotebookFavoriteInDB:", { userId });

  try {
    await prisma.notebook.update({
      where: { id, userId },
      data: { isFavorite },
    });

    return {
      success: true,
      type: "NOTEBOOKS",
      code: isFavorite
        ? ServerErrorCodes.NOTEBOOKS.SUCCESS_ADD_TO_FAVORITE
        : ServerErrorCodes.NOTEBOOKS.SUCCESS_REMOVE_FROM_FAVORITE,
    };
  } catch (error) {
    console.error("Error in setNotebookFavoriteInDB:", error);

    return {
      success: false,
      type: "NOTEBOOKS",
      code: isFavorite
        ? ServerErrorCodes.NOTEBOOKS.ERROR_ADD_TO_FAVORITE
        : ServerErrorCodes.NOTEBOOKS.ERROR_REMOVE_FROM_FAVORITE,
    };
  }
};
