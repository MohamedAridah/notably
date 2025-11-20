import { NextResponse } from "next/server";
import { getCachedNotebooks } from "@/server/notebooks";

export async function GET() {
  const { success, notebooks } = await getCachedNotebooks();

  const selectedData = notebooks?.map((notebook) => ({
    id: notebook.id,
    name: notebook.name,
  }));

  return NextResponse.json({ success, notebooks: selectedData });
}
