import { Suspense } from "react";
import UserBioPanel from "@/app/[locale]/(settings)/_components/(profile)/user-bio-panel";
import UserInfoPanel from "@/app/[locale]/(settings)/_components/(profile)/user-info-panel";
import PageHeader from "@/app/[locale]/(settings)/_components/page-header";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const t = await getTranslations("ProfilePage");
  const tCommon = await getTranslations("Common.terms");
  return (
    <>
      <PageHeader title={t("title")} />

      <Suspense fallback={tCommon("loading")}>
        <UserBioPanel />
      </Suspense>
      <Suspense fallback={tCommon("loading")}>
        <UserInfoPanel />
      </Suspense>
    </>
  );
}
