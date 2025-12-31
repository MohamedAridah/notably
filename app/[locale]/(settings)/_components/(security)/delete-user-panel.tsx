import DeleteAccountAction from "@/app/[locale]/(settings)/_components//(security)/delete-account-button";
import PageHeader from "@/app/[locale]/(settings)/_components/page-header";
import { getTranslations } from "next-intl/server";

export default async function DeleteUserPanel() {
  const t = await getTranslations("SecurityPage.deleteUserPanel");

  return (
    <div>
      <PageHeader title={t("title")} className="text-destructive" />
      <p className="text-sm text-muted-foreground mb-4">{t("description")}</p>

      <DeleteAccountAction />
    </div>
  );
}
