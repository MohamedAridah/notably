"use server";

import prisma from "@/lib/prisma";

/**
 * Empty user trash [delete notebooks, notes in located in trash].
 */
export const emptyUserTrash = async (userId: string) => {
  if (!userId) {
    return {
      success: false,
      message: "Invalid user ID provided",
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
      message: "Success! Trash has been emptied.",
    };
  } catch (error) {
    console.error("DB Error in emptyUserTrash:", error);

    return {
      success: false,
      message: "Failed to empty trash",
    };
  }
};
