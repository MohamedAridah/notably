import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { deleteEmptyNotesAction } from "@/server/notes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileXIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DeleteEmptyNotes() {
  const t = useTranslations("DeleteEmptyNotesButton");
  const tServerCode = useTranslations("serverCodes.NOTES");
  const router = useRouter();

  const handleDeleteEmptyNotes = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    try {
      toast.promise(deleteEmptyNotesAction, {
        loading: t("toasts.loading"),
        success: ({ code }) => {
          router.push("/dashboard");
          return { message: tServerCode(code) };
        },
        error: ({ code }) => {
          return { message: tServerCode(code) };
        },
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("toasts.errorDelete"));
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDeleteEmptyNotes}
      title={t("label")}
    >
      <FileXIcon />
    </Button>
  );
}
