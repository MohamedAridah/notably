"use client";

import * as React from "react";
import {
  Editor,
  EditorContent,
  EditorContext,
  JSONContent,
  useEditor,
} from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
// import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";
// import { ImageUploadNode } from "@/components/editor/node-styles/image-upload-node/image-upload-node-extension";
import { useIsMobile } from "@/hooks/tiptap-editor-hooks/use-mobile";
import { useWindowSize } from "@/hooks/tiptap-editor-hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/tiptap-editor-hooks/use-cursor-visibility";
// import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import "@/components/editor/node-styles/paragraph-node.scss";
import { MainToolbarContent } from "./buttons-ui/editor-toolbar";
import dynamic from "next/dynamic";
import { toast } from "sonner";
const MobileToolbarContent = dynamic(
  () =>
    import("./buttons-ui/editor-toolbar").then(
      (mod) => mod.MobileToolbarContent
    ),
  { ssr: false }
);

interface RichTextEditorProps {
  noteId: string;
  content: JSONContent[];
}

type MobileViewsType = "main" | "highlighter" | "link";

export default function RichTextEditor({
  content,
  noteId,
}: RichTextEditorProps) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<MobileViewsType>("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    autofocus: true,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      // Image,
      // ImageUploadNode.configure({
      //   accept: "image/*",
      //   maxSize: MAX_FILE_SIZE,
      //   limit: 3,
      //   upload: handleImageUpload,
      //   onError: (error) => console.error("Upload failed:", error),
      // }),
    ],
    content,
  });

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const hanldleBrowserClose = (e: BeforeUnloadEvent) => {
    if (JSON.stringify(content) === JSON.stringify(editor?.getHTML())) {
      return;
    }
    toast.warning("Save your work or it will be gone!");
    e.preventDefault();
  };

  React.useEffect(() => {
    window.addEventListener("beforeunload", hanldleBrowserClose);

    () => window.removeEventListener("beforeunload", hanldleBrowserClose);
  }, [content, editor?.getHTML()]);

  return (
    <>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              noteId={noteId}
              editor={editor as Editor}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          ref={editorRef}
          editor={editor}
          role="presentation"
          className="max-w-[900px] mx-auto flex flex-col flex-1 pt-[1rem] px-[1.5rem] pb-[5vh] sm:pt-[4rem] sm:px-[3rem] sm:pb-[14vh]"
        />
      </EditorContext.Provider>
    </>
  );
}
