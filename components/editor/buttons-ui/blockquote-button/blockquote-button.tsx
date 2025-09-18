import { useBlockquote } from "@/components/editor/buttons-ui/blockquote-button/use-blockquote";
import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import "@/components/editor/node-styles/blockquote-node.scss";

export const BlockquoteButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useBlockquote} {...props} />;
};
