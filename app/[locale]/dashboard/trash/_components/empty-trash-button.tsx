"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { emptyTrashAction } from "@/server/trash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import DialogTriggerButton, {
  TriggerAppearance,
} from "@/components/utils/dialog-trigger-button";
import LoadingSwap from "@/components/utils/loading-swap";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DialogProps {
  callbackURL?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EmptyTrashDialog({
  callbackURL,
  isOpen,
  setIsOpen,
  trigger,
  withTrigger = true,
}: DialogProps & TriggerAppearance) {
  const t = useTranslations("EmptyTrashButton");
  const tServerCode=useTranslations('serverCodes.TRASH')
  const router = useRouter();
  const [dialogState, setDialogState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const position = "top-center";

  const handleDeleteNotebook = async () => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;

    if (!userId) {
      toast.error(t("toasts.errorAuth"));
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading(t("toasts.loading"), { position });

    try {
      const { success, code } = await emptyTrashAction();

      if (success) {
        toast.success(tServerCode(code), { id: toastId, position });
        if (callbackURL) router.push(callbackURL);
      } else toast.error(tServerCode(code), { id: toastId, position });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeleting(false);
      setIsOpen ? setIsOpen(false) : setDialogState(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen ?? dialogState}
      onOpenChange={setIsOpen ?? setDialogState}
    >
      {withTrigger && (
        <AlertDialogTrigger asChild>
          <DialogTriggerButton
            asIcon={trigger?.asIcon}
            asIconHidden={trigger?.asIconHidden}
            asLabel={trigger?.asLabel}
            variant="destructive"
            size="sm"
            state={isDeleting}
            idleText={t("labelShort")}
            processText={t("labelProcessing")}
            icon={Trash2}
            className="group-hover/notebook-buttons:opacity-100"
            classNameAsIocn="hover:text-red-500"
          />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("labelLong")}</AlertDialogTitle>

          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel />

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteNotebook}
          >
            <LoadingSwap
              isLoading={isDeleting}
              loadingText={t("labelProcessing")}
            >
              {t("labelShort")}
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
