import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import { useMark } from "@/components/editor/buttons-ui/mark-button/use-mark";

export const MarkButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useMark} {...props} />;
};
