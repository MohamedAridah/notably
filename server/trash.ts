"use server"

import { revalidatePath, revalidateTag } from "next/cache";
import { isUserAuthed } from "@/server/auth";
import { emptyUserTrash } from "@/lib/db/trash";

export const emptyTrashAction = async () => {
  const userId = await isUserAuthed();
  const result = await emptyUserTrash(userId);

  revalidateTag(`trashed-notebooks-user-${userId}`);
  revalidateTag(`trashed-notes-user-${userId}`);
  revalidatePath("/dashboard");

  return result;
};
