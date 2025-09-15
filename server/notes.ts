"use server";

import prisma from "@/lib/prisma";
import { Note } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import errorMessage from "@/helpers/errorMessage";
import { revalidatePath, revalidateTag } from "next/cache";
import { isUserAuthed } from "./auth";

export const getNoteById = async (id: string) => {
  const session = await isUserAuthed();

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
    console.log({ error });

    return {
      success: false,
      message: errorMessage(error) || "Failed to get note",
    };
  }
};

export const createNote = async (
  title: string,
  content: InputJsonValue,
  notebookId: string
) => {
  const session = await isUserAuthed();
  const userId = session.userId as string;

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        notebookId,
      },
    });
    console.log(note);
    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
    return { success: true, message: "Note created successfully" };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to create note",
    };
  }
};

export const updateNote = async (id: string, values: Partial<Note>) => {
  const session = await isUserAuthed();
  const userId = session.userId as string;
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
    console.log(note);
    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
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
  const session = await isUserAuthed();
  const userId = session.userId as string;
  try {
    const note = await prisma.note.delete({
      where: {
        id,
      },
    });
    console.log(note);
    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
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
