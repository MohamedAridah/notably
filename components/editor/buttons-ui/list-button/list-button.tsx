import { useList } from "./use-list";
import EditorButton, {
  EditorButtonProps,
} from "@/components/editor/buttons-ui/editor-button";
import "@/components/editor/node-styles/list-node.scss";

export const ListButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useList} {...props} />;
};
