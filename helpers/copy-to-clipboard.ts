import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied successfully!", { position: "top-center" });
  } catch (error) {
    console.error(error);
    toast.error("Failed to copy.", { position: "top-center" });
  }
};
