"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/utils/responsive-dialog";
import LoadingSwap from "@/components/utils/loading-swap";

export default function DeleteAccountAction() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteUser = async () => {
    try {
      setIsDeletingAccount(true);

      return await authClient.deleteUser({
        callbackURL: "/",
        fetchOptions: {
          onError: ({ error }) => {
            toast.error(
              error.message || "Something went wrong. Can't delete account now."
            );
          },
          onSuccess: () => {
            toast.success("Delete account initiated", {
              description: "Please check you email to confirm account deletion",
            });

            setIsDeleteOpen(false);
          },
        },
      });
    } catch (error) {
      const e = error as Error;
      toast.error(e.message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete Account"
        description="This action cannot be undone. This will permanently delete your account and remove all your data from our servers."
        asAlert
      >
        <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 [&_button]:max-sm:w-full">
          <Button
            size={"sm"}
            onClick={handleDeleteUser}
            disabled={isDeletingAccount}
            className="sm:order-2"
          >
            <LoadingSwap isLoading={isDeletingAccount}>Yes, Delete</LoadingSwap>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setIsDeleteOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </ResponsiveDialog>

      <Button
        variant="destructive"
        className="w-full"
        size={"sm"}
        onClick={() => setIsDeleteOpen(true)}
      >
        Delete Account Permanently
      </Button>
    </>
  );
}
