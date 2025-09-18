"use client";

import { Separator } from "@/components/ui/separator";
import SaveNoteButton, {
  type SaveNoteButtonProps,
} from "@/components/editor/buttons-ui/save-button";
import { UndoRedoButton } from "@/components/editor/buttons-ui/undo-redo-button/undo-redo-button";
import HeadingDropdownMenu from "@/components/editor/buttons-ui/heading-dropdown-menu/heading-dropdown-menu";
import ListDropdownMenu from "@/components/editor/buttons-ui/list-dropdown-menu/list-dropdown-menu";
import { BlockquoteButton } from "@/components/editor/buttons-ui/blockquote-button/blockquote-button";
import { CodeBlockButton } from "@/components/editor/buttons-ui/code-block-button/code-block-button";
import { MarkButton } from "@/components/editor/buttons-ui/mark-button/mark-button";
import ColorHighlightPopover, {
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "@/components/editor/buttons-ui/color-highlight-popover/color-highlight-popover";
import LinkPopover, {
  LinkButton,
  LinkContent,
} from "@/components/editor/buttons-ui/link-popover/link-popover";
import { TextAlignButton } from "@/components/editor/buttons-ui/text-align-button/text-align-button";
import { ToolbarGroup } from "@/components/tiptap-ui-primitive/toolbar";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { ArrowLeftIcon, HighlighterIcon, LinkIcon } from "lucide-react";

interface MainToolbarContentProps extends SaveNoteButtonProps {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}

export const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  editor,
  noteId,
}: MainToolbarContentProps) => {
  return (
    <section className="w-full px-1 flex items-center gap-4">
      <div className="flex items-center justify-center gap-1 responsive-toolbar flex-wrap sm:flex-1">
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />

        <Separator />

        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />

        <Separator />

        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}

        <Separator />

        <MarkButton type="superscript" />
        <MarkButton type="subscript" />

        <Separator />

        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />

        {/* <Separator /> */}
        {/* <ImageUploadButton text="Add" className="min-w-fit" /> */}
      </div>
      <div className="flex items-center gap-1 pe-3 sm:justify-self-end sm:ml-auto w-[90px]">
        <Separator />
        <SaveNoteButton editor={editor} noteId={noteId} />
      </div>
    </section>
  );
};

export const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <Separator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);
