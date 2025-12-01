import { NextResponse } from "next/server";
import { updateNoteAction } from "@/server/notes";

export async function PATCH(req: Request) {
  const { id, content } = await req.json();

  if (!content || !id) {
    return NextResponse.json(
      { error: "No content  provided" },
      { status: 400 }
    );
  }

  const { success, message } = await updateNoteAction(id, { content });

  if (!success) {
    return NextResponse.json(
      { error: "Internal Server Error" + "\n" + message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success, message });
}
