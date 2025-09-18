"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/tiptap-editor-hooks/use-tiptap-editor";

// --- Tiptap UI ---
import {
  headingIcons,
  type Level,
  isHeadingActive,
  canToggle,
  shouldShowButton,
} from "@/components/editor/buttons-ui/heading-button/use-heading";
import { HeadingIcon } from "lucide-react";

/**
 * Configuration for the heading dropdown menu functionality
 */
export interface UseHeadingDropdownMenuConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Available heading levels to show in the dropdown
   * @default [1, 2, 3, 4, 5, 6]
   */
  levels?: Level[];
  /**
   * Whether the dropdown should hide when headings are not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

/**
 * Gets the currently active heading level from the available levels
 */
export function getActiveHeadingLevel(
  editor: Editor | null,
  levels: Level[] = [1, 2, 3, 4, 5, 6]
): Level | undefined {
  if (!editor || !editor.isEditable) return undefined;
  return levels.find((level) => isHeadingActive(editor, level));
}

export function useHeadingDropdownMenu(config?: UseHeadingDropdownMenuConfig) {
  const {
    editor: providedEditor,
    levels = [1, 2, 3, 4, 5, 6],
    hideWhenUnavailable = false,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);

  const activeLevel = getActiveHeadingLevel(editor, levels);
  const isActive = isHeadingActive(editor);
  const canToggleState = canToggle(editor);

  React.useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowButton({ editor, hideWhenUnavailable, level: levels })
      );
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, levels]);

  return {
    isVisible,
    activeLevel,
    isActive,
    canToggle: canToggleState,
    levels,
    label: "Heading",
    Icon: activeLevel ? headingIcons[activeLevel] : HeadingIcon,
  };
}
