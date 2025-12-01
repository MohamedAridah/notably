import { Button } from "../ui/button";
import { FileXIcon } from "lucide-react";
import { deleteEmptyNotesAction } from "@/server/notes";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteEmptyNotes() {
  const router = useRouter();

  const handleDeleteEmptyNotes = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error("You must be signed in to create a note.");
      return;
    }

    try {
      toast.promise(deleteEmptyNotesAction, {
        loading: "Deleting empty notes...",
        success: ({ message }) => {
          router.push("/dashboard");
          return { message };
        },
        error: ({ message }) => {
          return { message };
        },
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete empty notes!");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDeleteEmptyNotes}
      title="Delete Empty Notes."
    >
      <FileXIcon />
    </Button>
  );
}
