"use server";

import prisma from "@/lib/prisma";
import { Notebook } from "@prisma/client";
import errorMessage from "@/helpers/errorMessage";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { APIError } from "better-auth";
import { isUserAuthed } from "./auth";

export const getNotebooks = async (userId: string) => {
  try {
    console.log("getNotebooks called");
    const notebooks = await prisma.notebook.findMany({
      where: {
        userId,
      },
      select: {
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
          },
        },
        id: true,
        isDefault: true,
        isFavorite: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    return { success: true, notebooks };
  } catch (error) {
    if ((error as APIError).statusCode === 500) {
      return {
        success: false,
        message: "Internal Server Error",
        description: (error as APIError).message,
      };
    }

    return {
      success: false,
      message: (error as Error).message || "Failed to get notebooks",
    };
  }
};

export const getCachedNotebooks = async () => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  return unstable_cache(
    async () => {
      console.log("getCachedNotebooks called");
      return getNotebooks(userId);
    },
    [`notebooks-user-${userId}`],
    {
      tags: [`notebooks-user-${userId}`],
    }
  )();
};

export const getNotebookById = async (id: string, userId: string) => {
  try {
    console.log("getNotebook called with id:", id);
    const notebook = await prisma.notebook.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
        notes: {
          select: {
            id: true,
            notebookId: true,
            title: true,
            isFavorite: true,
            createdAt: true,
          },
        },
      },
    });

    return { success: true, notebook };
  } catch (error) {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const getCachedNotebook = async (id: string) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  return unstable_cache(
    async () => getNotebookById(id, userId),
    [`notebook-${id}-${userId}`],
    {
      tags: [`notebook-${id}`, `notebooks-user-${userId}`],
    }
  )();
};

export const createNotebook = async (name: string, userId: string) => {
  try {
    const notebook = await prisma.notebook.create({
      data: {
        name,
        userId,
      },
    });

    revalidateTag(`notebooks-user-${userId}`);
    revalidatePath("/dashboard");
    return {
      success: true,
      id: notebook.id,
      message: "Notebook created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to create notebook",
    };
  }
};

export const updateNotebook = async (id: string, values: Partial<Notebook>) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    const notebook = await prisma.notebook.update({
      where: {
        id,
        userId,
      },
      data: values,
    });

    revalidateTag(`notebook-${id}`);
    revalidateTag(`notebooks-user-${notebook.userId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Notebook updated successfully",
    };
  } catch (error) {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const deleteNotebook = async (id: string) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    const notebook = await prisma.notebook.delete({
      where: {
        id,
        userId,
      },
    });

    revalidateTag(`notebook-${id}`);
    revalidateTag(`notebooks-user-${notebook.userId}`);
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Notebook deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to delete notebook",
    };
  }
};

export const setNotebookFavorite = async (id: string, isFavorite: boolean) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    const notebook = await prisma.notebook.update({
      where: { id, userId },
      data: { isFavorite },
    });

    revalidateTag(`notebook-${id}`);
    revalidateTag(`notebooks-user-${notebook.userId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: isFavorite
        ? "Notebook added to your favorites."
        : "Notebook removed from your favorites.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        errorMessage(error) ||
        `Failed to ${isFavorite ? "add" : "remove"} notebook from favorites`,
    };
  }
};

export async function createQuickNotesNotebook(userId: string) {
  try {
    await prisma.notebook.create({
      data: {
        name: "Quick Notes",
        userId,
        isDefault: true,
      },
    });
  } catch (err) {
    console.log("Error creating Quick Notes notebook:", err);
  }
}
