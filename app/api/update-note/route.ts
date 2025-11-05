import { updateNote } from "@/server/notes";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id, content } = await req.json();

  if (!content || !id) {
    return NextResponse.json(
      { error: "No content  provided" },
      { status: 400 }
    );
  }

  const { success, message } = await updateNote(id, { content });

  if (!success) {
    return NextResponse.json(
      { error: "Internal Server Error" + "\n" + message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success, message });
}
