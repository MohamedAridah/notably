import { NextResponse } from "next/server";
import { getCachedNotebooksAction } from "@/server/notebooks";

export async function GET() {
  const { success, notebooks } = await getCachedNotebooksAction();

  const selectedData = notebooks?.map((notebook) => ({
    id: notebook.id,
    name: notebook.name,
  }));

  return NextResponse.json({ success, notebooks: selectedData });
}
