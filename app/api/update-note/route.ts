import { NextResponse } from "next/server";
import { updateNoteAction } from "@/server/notes";
import { isUserAuthed } from "@/server/auth";
import { ServerErrorCodes } from "@/helpers/server-error-codes";

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
    const { success, code } = await updateNoteAction(id, { content });

    if (!success) {
      return NextResponse.json({ code }, { status: 500 });
    }

    return NextResponse.json({ success, code });
  } catch (error) {
    return NextResponse.json(
      { code: ServerErrorCodes.AUTH.NOT_AUTHENTICATED },
      { status: 401 }
    );
  }
}
