import PageHeader from "@/app/[locale]/(settings)/_components/page-header";
import DeleteUserPanel from "@/app/[locale]/(settings)/_components/(security)/delete-user-panel";
import ChangePasswordPanel from "@/app/[locale]/(settings)/_components/(security)/change-password-panel"
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Security",
};

export default async function SecurityPage() {
  const t = await getTranslations("SecurityPage");

  return (
    <>
      <PageHeader title={t("title")} />

      <div className="space-y-10">
        <ChangePasswordPanel />
        <DeleteUserPanel />
      </div>
    </>
  );
}
