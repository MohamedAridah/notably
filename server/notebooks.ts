"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { Notebook } from "@prisma/client";
import errorMessage from "@/helpers/errorMessage";
import { revalidatePath } from "next/cache";

export const createNotebook = async (name: string, userId: string) => {
  try {
    await prisma.notebook.create({
      data: {
        name,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, message: "Notebook created successfully" };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to create notebook",
    };
  }
};

export const getNotebooks = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!userId) {
      return { success: false, message: "User not found" };
    }

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
    return { success: false, message: "Failed to get notebooks" };
  }
};

export const getNotebookById = async (id: string) => {
  try {
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

export const updateNotebook = async (id: string, values: Notebook) => {
  try {
    const notebook = await prisma.notebook.update({
      where: {
        id,
      },
      data: values,
    });

    revalidatePath("/dashboard");
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
  try {
    const notebook = await prisma.notebook.delete({
      where: {
        id,
      },
    });

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
