"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/helpers/format-date";
import Panel from "@/app/[locale]/(settings)/_components/panel";
import UserInfoSkeleton from "@/app/[locale]/(settings)/_components/(skeletons)/user-info-skeleton";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/utils/responsive-dialog";
import ProfileUpdateForm from "@/app/[locale]/(settings)/_components/forms/update-profile-form";
import EmailUpdateForm from "@/app/[locale]/(settings)/_components/forms/update-email-form";
import { useLocale, useTranslations } from "next-intl";
import { MailIcon, PenIcon } from "lucide-react";
import LocaleSwitcher from "@/components/utils/locale-switcher";

const UserInfoPanel = () => {
  const locale = useLocale();
  const t = useTranslations("ProfilePage.infoPanel");
  const tLang = useTranslations("LocaleSwitcher");
  const tUpdateForm = useTranslations("UpdateProfileForm");
  const tUpdateEmail = useTranslations("ChangeEmailForm");
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
        title={t("title")}
        action={
          <>
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => setisUpdateProfileOpened(true)}
            >
              <PenIcon /> {t("actions.update")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">
              {t("info.firstName")}
            </p>
            <p className="text-base">{person?.name}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">
              {t("info.memberSince")}
            </p>
            <p className="text-base">
              {formatDate({ date: person?.createdAt as Date, locale })}
            </p>
          </div>

          <div className="flex justify-between">
            <div className="group flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">{t("info.email")}</p>
              <p className="text-base">{person?.email}</p>
            </div>

            <Button
              size="sm"
              variant={"outline"}
              className="place-self-end"
              onClick={() => setIsChangeEmailOpened(true)}
            >
              <MailIcon /> {t("actions.change")}
            </Button>
          </div>

          <div className="flex justify-between">
            <div className="group flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">
                {t("info.language")}
              </p>
              <p className="text-base">{tLang(locale)}</p>
            </div>

            <LocaleSwitcher withLabel />
          </div>
        </div>
      </Panel>

      <ResponsiveDialog
        title={tUpdateForm("title")}
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
        title={tUpdateEmail("title")}
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
