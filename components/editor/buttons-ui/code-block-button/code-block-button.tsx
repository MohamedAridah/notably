import { useCodeBlock } from "@/components/editor/buttons-ui/code-block-button/use-code-block";
import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import "@/components/editor/node-styles/code-block-node.scss";

export const CodeBlockButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useCodeBlock} {...props} />;
};
