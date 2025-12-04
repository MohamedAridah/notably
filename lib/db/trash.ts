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
  try {
    await prisma.notebook.deleteMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
    });

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
