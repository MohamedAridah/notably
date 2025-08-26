"use client";

import dynamic from "next/dynamic";
import EditorSkeleton from "@/components/(skeletons)/exitor";

// Dynamically load the client-only RichTextEditor (defined as named export)
const RichTextEditor = dynamic(
  () => import("./editor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

export default function RichTextEditorClient(props: any) {
  return <RichTextEditor {...props} />;
}
