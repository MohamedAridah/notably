import { NextResponse } from "next/server";
import { getCachedNotebooksAction } from "@/server/notebooks";
import { isUserAuthed } from "@/server/auth";

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

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
