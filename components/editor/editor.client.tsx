"use client";

import dynamic from "next/dynamic";
import EditorSkeleton from "@/components/(skeletons)/exitor";

const RichTextEditor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export default function RichTextEditorClient(props: any) {
  return <RichTextEditor {...props} />;
}
