"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useLogout from "@/hooks/use-logout";
import { useTranslations } from "next-intl";

export default function Logout() {
  const t = useTranslations("LogoutButton");
  const { handleLogout, isLoading } = useLogout();

  return (
    <Button variant="outline" onClick={handleLogout}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" /> {t("label")}
        </>
      ) : (
        <>{t("label")}</>
      )}
    </Button>
  );
}
