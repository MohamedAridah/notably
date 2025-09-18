import { useImageUpload } from "./use-image-upload";
import EditorButton, { EditorButtonProps } from "../editor-button";
import "@/components/editor/node-styles/image-node.scss";

export const ImageUploadButton = ({
  ...props
}: Omit<EditorButtonProps, "useHook">) => {
  return <EditorButton useHook={useImageUpload} {...props} />;
};

export default ImageUploadButton;
