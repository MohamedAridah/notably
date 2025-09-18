import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import { useTextAlign } from "@/components/editor/buttons-ui/text-align-button/use-text-align";

export const TextAlignButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useTextAlign} {...props} />;
};
