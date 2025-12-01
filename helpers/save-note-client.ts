import { Note } from "@prisma/client";

export const saveNote = async (noteId: string, content: Note["content"]) => {
  try {
    const res = await (
      await fetch("/api/update-note", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId, content }),
      })
    ).json();

    return res;
  } catch (err) {
    console.error("Update note error:", err);
  }
};
