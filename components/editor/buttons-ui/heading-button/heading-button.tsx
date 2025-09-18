import { useHeading } from "./use-heading";
import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import "@/components/editor/node-styles/heading-node.scss";

export const HeadingButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useHeading} {...props} />;
};
