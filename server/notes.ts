"use server";

import prisma from "@/lib/prisma";
import { Note } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import errorMessage from "@/helpers/errorMessage";
import { revalidatePath } from "next/cache";

export const createNote = async (
  title: string,
  content: string,
  notebookId: string
) => {
  try {
    await prisma.note.create({
      data: {
        title,
        content,
        notebookId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, message: "Note created successfully" };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to create note",
    };
  }
};

export const getNoteById = async (id: string) => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id,
      },
      include: {
        notebook: true,
      },
    });

    return { success: true, note };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to get note",
    };
  }
};

export const updateNote = async (id: string, values: Note) => {
  try {
    const note = await prisma.note.update({
      where: {
        id,
      },
      data: {
        content: values.content as InputJsonValue,
        title: values.title,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      note,
      message: "Note updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to get note",
    };
  }
};

export const deleteNote = async (id: string) => {
  try {
    const note = await prisma.note.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to delete note",
    };
  }
};
