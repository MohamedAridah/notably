"use server";

import { ServerErrorCodes } from "@/helpers/server-error-codes";
import prisma from "@/lib/prisma";

/**
 * Empty user trash [delete notebooks, notes in located in trash].
 */
export const emptyUserTrash = async (userId: string) => {
  if (!userId) {
    return {
      success: false,
      code: ServerErrorCodes.AUTH.INVALID_USER_ID,
    };
  }

  console.log("DB Query: emptyUserTrash:", { userId });
  const deleteNotebooksPromise = prisma.notebook.deleteMany({
    where: {
      userId,
      deletedAt: { not: null },
    },
  });
  const deleteNotesPromise = prisma.note.deleteMany({
    where: {
      userId,
      deletedAt: { not: null },
    },
  });
  try {
    await prisma.$transaction([deleteNotebooksPromise, deleteNotesPromise]);
    return {
      success: true,
      code: ServerErrorCodes.TRASH.SUCCESS_DELETE,
    };
  } catch (error) {
    console.error("DB Error in emptyUserTrash:", error);

    return {
      success: false,
      code: ServerErrorCodes.TRASH.ERROR_DELETE,
    };
  }
};
