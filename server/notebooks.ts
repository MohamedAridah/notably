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
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
        notes: true,
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
  const session = await isUserAuthed();
  const userId = session.userId as string;

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

export const getNotebookById = async (id: string) => {
  try {
    console.log("getNotebook called with id:", id);
    const notebook = await prisma.notebook.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
        notes: true,
      },
    });

    return { success: true, notebook };
  } catch (error) {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const getCachedNotebook = async (id: string) => {
  const session = await isUserAuthed();
  const userId = session.userId as string;

  return unstable_cache(async () => getNotebookById(id), [`notebook-${id}`], {
    tags: [`notebook-${id}-user-${userId}`],
  })();
};

export const createNotebook = async (name: string, userId: string) => {
  const session = await isUserAuthed();

  try {
    await prisma.notebook.create({
      data: {
        name,
        userId,
      },
    });

    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
    return { success: true, message: "Notebook created successfully" };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to create notebook",
    };
  }
};

export const updateNotebook = async (id: string, values: Partial<Notebook>) => {
  const session = await isUserAuthed();

  try {
    const notebook = await prisma.notebook.update({
      where: {
        id,
      },
      data: values,
    });

    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${notebook.userId}`);

    return {
      success: true,
      notebook,
      message: "Notebook updated successfully",
    };
  } catch (error) {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const deleteNotebook = async (id: string) => {
  const session = await isUserAuthed();

  try {
    const notebook = await prisma.notebook.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${notebook.userId}`);
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
