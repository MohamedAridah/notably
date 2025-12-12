import { NextResponse } from "next/server";
import { updateNoteAction } from "@/server/notes";
import { isUserAuthed } from "@/server/auth";

export async function PATCH(req: Request) {
  const { id, content } = await req.json();

  if (!content || !id) {
    return NextResponse.json(
      { error: "No content  provided" },
      { status: 400 }
    );
  }

  try {
    await isUserAuthed();
    const { success, message } = await updateNoteAction(id, { content });

    if (!success) {
      return NextResponse.json(
        { error: "Internal Server Error" + "\n" + message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success, message });
  } catch (error) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
