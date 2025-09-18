import { type Editor } from "@tiptap/react";
import { useTiptapEditor } from "@/hooks/tiptap-editor-hooks/use-tiptap-editor";
import { Button, ButtonProps } from "../../tiptap-ui-primitive/button";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { parseShortcutKeys } from "@/lib/tiptap-utils";
import { Mark } from "./mark-button/use-mark";
import { TextAlign } from "./text-align-button/use-text-align";
import { UndoRedoAction } from "./undo-redo-button/use-undo-redo";
import { Level } from "@/components/editor/buttons-ui/heading-button/use-heading";
import { ListType } from "./list-button/use-list";

interface ButtonConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

interface ButtonConfigAsMarkAndList {
  type?: Mark | ListType;
}

interface ButtonConfigAsAlign {
  align?: TextAlign;
  onAligned?: () => void;
}

interface ButtonConfigAsAction {
  action?: UndoRedoAction;
  onExecuted?: () => void;
}

interface ButtonConfigAsHeadings {
  level?: Level;
}

interface ButtonConfigAsUploadImage {
  onInserted?: () => void;
}

export type EditorButtonProps = {
  useHook: any;
  text?: string;
  showShortcut?: boolean;
} & ButtonConfig &
  ButtonConfigAsMarkAndList &
  ButtonConfigAsAlign &
  ButtonConfigAsHeadings &
  ButtonConfigAsAction &
  ButtonConfigAsUploadImage &
  Omit<ButtonProps, "type">;

const EditorButton = ({
  children,
  useHook,
  editor: providedEditor,
  hideWhenUnavailable,
  onToggled,
  onClick,
  text,
  showShortcut = false,
  type,
  align,
  onAligned,
  action,
  onExecuted,
  onInserted,
  level,
  ...buttonProps
}: EditorButtonProps) => {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    handleToggle,
    handleMark,
    canToggle,
    isActive,
    label,
    shortcutKeys,
    Icon,
    handleTextAlign,
    canAlign,
    handleAction,
    canExecute,
    canInsert,
    handleImage,
  } = useHook({
    editor,
    hideWhenUnavailable,
    onToggled,
    type,
    align,
    onAligned,
    action,
    level,
    onExecuted,
    onInserted,
  });

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleToggle && handleToggle();
      handleMark && handleMark();
      handleTextAlign && handleTextAlign();
      handleAction && handleAction();
      handleImage && handleImage();
    },
    [
      handleToggle,
      handleMark,
      handleTextAlign,
      handleAction,
      handleImage,
      onClick,
    ]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      data-active-state={isActive ? "on" : "off"}
      role="button"
      tabIndex={-1}
      disabled={!canToggle && !canAlign && !canExecute && !canInsert}
      data-disabled={!canToggle && !canAlign && !canExecute && !canInsert}
      aria-label={label}
      aria-pressed={isActive}
      tooltip={label}
      onClick={handleClick}
      {...buttonProps}
    >
      {children ?? (
        <>
          <Icon className="tiptap-button-icon" />
          {text && <span className="tiptap-button-text">{text}</span>}
          {showShortcut && <ShortcutBadge shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

export default EditorButton;

export function ShortcutBadge({ shortcutKeys }: { shortcutKeys?: string }) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}
