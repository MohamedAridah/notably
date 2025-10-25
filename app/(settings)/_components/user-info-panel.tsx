"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

import Panel from "./panel";
import UserInfoSkeleton from "./loading-states/user-info-skeleton";

import { MailIcon, PenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/utils/responsive-dialog";
import ProfileUpdateForm from "./forms/profile-update-form";
import EmailUpdateForm from "./forms/email-update-form";

const UserInfoPanel = () => {
  const { data, isPending } = authClient.useSession();
  const person = data?.user;

  const [isUpdateProfileOpened, setisUpdateProfileOpened] = useState(false);
  const [isChangeEmailOpened, setIsChangeEmailOpened] = useState(false);

  if (isPending) {
    return <UserInfoSkeleton />;
  }

  return (
    <>
      <Panel
        title="personal information"
        action={
          <>
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => setisUpdateProfileOpened(true)}
            >
              <PenIcon /> Update
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">First Name</p>
            <p className="text-base">{person?.name}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Member since</p>
            <p className="text-base">
              {new Date(person?.createdAt as Date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex justify-between">
            <div className="group flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-base">{person?.email}</p>
            </div>

            <Button
              size="sm"
              variant={"outline"}
              className="place-self-end"
              onClick={() => setIsChangeEmailOpened(true)}
            >
              <MailIcon /> Change
            </Button>
          </div>
        </div>
      </Panel>

      <ResponsiveDialog
        title="Update Your Profile"
        isOpen={isUpdateProfileOpened}
        setIsOpen={setisUpdateProfileOpened}
        asAlert
      >
        <ProfileUpdateForm
          user={{ name: person?.name as string }}
          setIsOpen={setisUpdateProfileOpened}
        />
      </ResponsiveDialog>

      <ResponsiveDialog
        title="Change Your Email"
        isOpen={isChangeEmailOpened}
        setIsOpen={setIsChangeEmailOpened}
        asAlert
      >
        <EmailUpdateForm
          user={{ email: person?.email as string }}
          setIsOpen={setIsChangeEmailOpened}
        />
      </ResponsiveDialog>
    </>
  );
};

export default UserInfoPanel;
