import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import { useUndoRedo } from "./use-undo-redo";

export const UndoRedoButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useUndoRedo} {...props} />;
};
