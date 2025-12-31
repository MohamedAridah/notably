import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChangePasswordForm from "@/app/[locale]/(settings)/_components/forms/change-password-form";
import { getTranslations } from "next-intl/server";

export default async function ChangePasswordPanel() {
  const t = await getTranslations("ChangePasswordForm");
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
