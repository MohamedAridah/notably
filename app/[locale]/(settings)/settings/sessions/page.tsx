import { Suspense } from "react";
import PageHeader from "@/app/[locale]/(settings)/_components/page-header";
import SessionsPanel from "../../_components/(sessions)/sessions-panel";
import UserBioSkeleton from "../../_components/(skeletons)/user-bio-skeleton";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Sessions",
};

export default async function SessionsPage() {
  const t = await getTranslations("SessionsPage");
  return (
    <>
      <PageHeader title={t("title")} />

      <Suspense fallback={<UserBioSkeleton />}>
        <SessionsPanel />
      </Suspense>
    </>
  );
}
