"use server";

import prisma from "@/lib/prisma";
import { Note } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import errorMessage from "@/helpers/errorMessage";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { isUserAuthed } from "./auth";

export const getNoteById = async (id: string) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    const note = await prisma.note.findUnique({
      where: {
        id,
        userId,
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

type CreateNoteProps = {
  title?: Note["title"];
  content?: InputJsonValue;
  notebookId?: string;
};

export async function createNote({
  title,
  content,
  notebookId,
}: CreateNoteProps) {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;
  let finalNotebookId = notebookId;
  try {
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
    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
    return {
      success: true,
      message: "Note created successfully",
      noteId: note.id,
      notebookId: note.notebookId,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: errorMessage(error) || "Failed to create note",
    };
  }
}

export type UpdateNoteValuesType = {
  title?: Note["title"];
  content?: InputJsonValue;
};

export const updateNote = async (id: string, values: UpdateNoteValuesType) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    await prisma.note.update({
      where: {
        id,
        userId,
      },
      data: { ...values },
      select: {
        id: true,
      },
    });
    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
    return {
      success: true,
      message: "Note saved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error) || "Failed to save note",
    };
  }
};

export const deleteNote = async (id: string) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    const note = await prisma.note.delete({
      where: {
        id,
        userId,
      },
    });
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

export const setNoteFavorite = async (id: string, isFavorite: boolean) => {
  const { session } = await isUserAuthed();
  const userId = session?.userId!;

  try {
    const note = await prisma.note.update({
      where: { id, userId },
      data: { isFavorite },
    });

    revalidateTag(`notebook-${note.notebookId}`);
    revalidateTag(`notebooks-user-${note.userId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: isFavorite
        ? "Note added to your favorites."
        : "Note removed from your favorites.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        errorMessage(error) ||
        `Failed to ${isFavorite ? "add" : "remove"} note from favorites`,
    };
  }
};

export const deleteEmptyNotes = async () => {
  const { session, message } = await isUserAuthed();
  if (!session) throw new Error(message);
  const userId = session?.userId!;

  try {
    await prisma.$executeRaw`DELETE FROM "note" WHERE "content" IS NULL`;
    revalidatePath("/dashboard");
    revalidateTag(`notebooks-user-${userId}`);
    return {
      success: true,
      message: "Empty notes deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: errorMessage(error) || "Failed to delete empty notes",
    };
  }
};
