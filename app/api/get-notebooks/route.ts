import { NextResponse } from "next/server";
import { getCachedNotebooksAction } from "@/server/notebooks";
import { isUserAuthed } from "@/server/auth";
import { ServerErrorCodes } from "@/helpers/server-error-codes";

export async function GET() {
  try {
    await isUserAuthed();
    const { success, notebooks } = await getCachedNotebooksAction();

    const selectedData = notebooks?.map((notebook) => ({
      id: notebook.id,
      name: notebook.name,
    }));

    return NextResponse.json({ success, notebooks: selectedData });
  } catch (error) {
    console.log({ error });

    return NextResponse.json(
      { code: ServerErrorCodes.AUTH.NOT_AUTHENTICATED },
      { status: 401 }
    );
  }
}
