import { _Translator } from "next-intl";
import { toast } from "sonner";

export const copyToClipboard = async (
  text: string,
  translation: _Translator<Record<string, any>>
) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(translation("success"), { position: "top-center" });
  } catch (error) {
    console.error(error);
    toast.error(translation("error"), { position: "top-center" });
  }
};
