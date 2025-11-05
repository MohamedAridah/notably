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
import clsx from "clsx";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { toast } from "sonner";
import LoadingSwap from "../utils/loading-swap";
import { saveNote } from "@/helpers/save-note-client";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<MobileViewsType>("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);

  const [isThereNewContent, setIsThereNewContent] = React.useState(false);

  const debouncedSave = useDebouncedCallback(async (id, content) => {
    const res = await saveNote(id, content);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsThereNewContent(false);
  }, 1000);

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

    onUpdate: async ({ editor }) => {
      const content = editor.getJSON();
      setIsThereNewContent(true);
      debouncedSave(noteId, content);
    },
    content,
  });

  const handleBeforeClose = (e: BeforeUnloadEvent) => {
    if (!isThereNewContent) return;
    toast.warning("Be careful there is Unsaved content.");
    e.preventDefault();
  };

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeClose);
    return () => window.removeEventListener("beforeunload", handleBeforeClose);
  }, [isThereNewContent]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

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
              isThereNewContent={isThereNewContent}
              setIsThereNewContent={setIsThereNewContent}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorState state={isThereNewContent} />

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

const EditorState = ({ state }: { state: boolean }) => {
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mt-4">
      <LoadingSwap isLoading={state} loadingText="Saving your changes...">
        <span className="size-2.5 rounded-full animate-caret-blink bg-green-400" />
        You are uptodate
      </LoadingSwap>
    </div>
  );
};
