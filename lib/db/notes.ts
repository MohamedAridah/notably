"use server";

import prisma from "@/lib/prisma";
import { Note, Prisma } from "@prisma/client";
import { ServerErrorCodes } from "@/helpers/server-error-codes";

/**
 * Get note by ID for a specific user
 */
export async function getNoteByIdFromDB(id: string, userId: string) {
  if (!id || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_INVALID_ID,
      note: null,
    };
  }

  console.log("DB Query: getNoteByIdFromDB:", { id, userId });

  try {
    const note = await prisma.note.findUnique({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        deletedAt: true,
        notebookId: true,
        notebook: {
          select: { name: true },
        },
      },
    });

    if (!note) {
      return {
        success: false,
        code: ServerErrorCodes.NOTES.ERROR_NOT_FOUND,
        note: null,
      };
    }

    return { success: true, note };
  } catch (error) {
    console.error("DB Error in getNoteByIdFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_FETCH_NOTE,
      note: null,
    };
  }
}

/**
 * Get all trashed notes for a user (soft deleted)
 */
export async function getTrashedNotesFromDB(userId: string) {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
      notes: null,
    };
  }

  console.log("DB Query: getTrashedNotesFromDB for user:", userId);

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      select: {
        id: true,
        title: true,
        isFavorite: true,
        createdAt: true,
        deletedAt: true,
        notebookId: true,
        notebook: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    return { success: true, notes };
  } catch (error) {
    console.error("DB Error in getTrashedNotesFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_FETCH_TRASH_NOTES,
      notes: null,
    };
  }
}

/**
 * Create new note
 */
export async function createNoteInDB(
  userId: string,
  title?: Note["title"],
  content?: Prisma.InputJsonValue,
  notebookId?: string
) {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: createNoteInDB for user:", userId);

  let finalNotebookId = notebookId;

  try {
    // Create default "Quick Notes" notebook if no notebook specified
    if (!notebookId) {
      const quickNotes = await prisma.notebook.upsert({
        where: {
          name_userId: {
            name: "Quick Notes",
            userId,
          },
        },
        update: {},
        create: {
          name: "Quick Notes",
          userId,
          isDefault: true,
        },
      });
      finalNotebookId = quickNotes.id;
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        notebookId: finalNotebookId,
        userId,
      },
      select: {
        id: true,
        notebookId: true,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTES.SUCCESS_CREATED,
      noteId: note.id,
      notebookId: note.notebookId,
    };
  } catch (error) {
    console.error("DB Error in createNoteInDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_CREATION,
    };
  }
}

/**
 * Update existing note
 */
export async function updateNoteInDB(
  id: string,
  userId: string,
  data: Partial<Note>
) {
  if (!id || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_INVALID_ID,
    };
  }

  console.log("DB Query: updateNoteInDB:", { id, userId });

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id,
        userId,
      },
      data: data as any,
      select: {
        id: true,
        notebookId: true,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTES.SUCCESS_UPDATED,
      noteId: updatedNote.id,
      notebookId: updatedNote.notebookId,
    };
  } catch (error) {
    console.error("DB Error in updateNoteInDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_UPDATE,
    };
  }
}

/**
 * Move note to trash (soft delete)
 */
export async function trashNoteInDB(noteId: string, userId: string) {
  if (!noteId || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_INVALID_ID,
    };
  }

  console.log("DB Query: moveNoteToTrashInDB:", { noteId, userId });

  try {
    const deletedNote = await prisma.note.update({
      where: {
        id: noteId,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        notebookId: true,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTES.SUCCESS_MOVE_TO_TRASH,
      notebookId: deletedNote.notebookId,
    };
  } catch (error) {
    console.error("DB Error in moveNoteToTrashInDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_TRASH,
    };
  }
}

/**
 * Restore note from trash
 */
export async function restoreNoteInDB(noteId: string, userId: string) {
  if (!noteId || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_INVALID_ID,
    };
  }

  console.log("DB Query: restoreNoteFromTrashInDB:", { noteId, userId });

  try {
    const restoredNote = await prisma.note.update({
      where: {
        id: noteId,
        userId,
      },
      data: {
        deletedAt: null,
      },
      select: {
        notebookId: true,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTES.SUCCESS_RESTORE,
      notebookId: restoredNote.notebookId,
    };
  } catch (error) {
    console.error("DB Error in restoreNoteFromTrashInDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_RESTORE,
    };
  }
}

/**
 * Permanently delete note from database
 */
export async function deleteNoteFromDB(noteId: string, userId: string) {
  if (!noteId || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_INVALID_ID,
    };
  }

  console.log("DB Query: deleteNotePermanentlyFromDB:", { noteId, userId });

  try {
    const deletedNote = await prisma.note.delete({
      where: {
        id: noteId,
        userId,
      },
      select: {
        notebookId: true,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.NOTES.SUCCESS_DELETE,
      notebookId: deletedNote.notebookId,
    };
  } catch (error) {
    console.error("DB Error in deleteNotePermanentlyFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_DELETE,
    };
  }
}

/**
 * Toggle note favorite status
 */
export async function setNoteFavoriteInDB(
  id: string,
  userId: string,
  isFavorite: boolean
) {
  if (!id || !userId) {
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_INVALID_ID,
    };
  }

  console.log("DB Query: setNoteFavoriteInDB:", { id, userId, isFavorite });

  try {
    const note = await prisma.note.update({
      where: { id, userId },
      data: { isFavorite },
      select: {
        notebookId: true,
      },
    });

    return {
      success: true,
      type: "NOTES",
      code: isFavorite
        ? ServerErrorCodes.NOTES.SUCCESS_ADD_TO_FAVORITE
        : ServerErrorCodes.NOTES.SUCCESS_REMOVE_FROM_FAVORITE,
      notebookId: note.notebookId,
    };
  } catch (error) {
    console.error("DB Error in setNoteFavoriteInDB:", error);
    return {
      success: false,
      type: "NOTES",
      code: isFavorite
        ? ServerErrorCodes.NOTES.ERROR_ADD_TO_FAVORITE
        : ServerErrorCodes.NOTES.ERROR_REMOVE_FROM_FAVORITE,
    };
  }
}

/**
 * Delete all empty notes for a user (notes with no content)
 */
export async function deleteEmptyNotesFromDB(userId: string) {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: deleteEmptyNotesFromDB for user:", userId);

  try {
    const deleteAllEmpty =
      await prisma.$executeRaw`DELETE FROM "note" WHERE "content" IS NULL AND "title" IS NULL AND "userId" = ${userId}`;
    console.log({ deleteAllEmpty });

    return {
      success: true,
      code: ServerErrorCodes.NOTES.SUCCESS_DELETE_EMPTY,
    };
  } catch (error) {
    console.error("DB Error in deleteEmptyNotesFromDB:", error);
    return {
      success: false,
      code: ServerErrorCodes.NOTES.ERROR_DELETE_EMPTY,
    };
  }
}
