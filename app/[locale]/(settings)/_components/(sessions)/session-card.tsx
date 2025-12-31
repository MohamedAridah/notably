"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";
import { Session } from "better-auth";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/helpers/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBrowserInfo } from "@/app/[locale]/(settings)/_components/utils/get-browser-info";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/utils/loading-swap";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { MonitorIcon, SmartphoneIcon, Trash2 } from "lucide-react";

interface SessionCardType {
  session: Session;
  isCurrentSession?: boolean;
}

export default function SessionCard({
  session,
  isCurrentSession = false,
}: SessionCardType) {
  const t = useTranslations("SessionsPage.sessionCard");
  const tCommon = useTranslations("Common.terms");
  const tRevoke = useTranslations("RevokeSessionButton");
  const locale = useLocale();
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const handleRevokeSession = async (session: Session) => {
    startTransition(async () => {
      try {
        await authClient.revokeSession({
          token: session.token,
          fetchOptions: {
            onError: ({ error }) => {
              toast.error(
                error.message || tRevoke("toasts.error", { count: 1 })
              );
            },
            onSuccess: () => {
              toast.success(tRevoke("toasts.success", { count: 1 }));
              router.refresh();
            },
          },
        });
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || tRevoke("toasts.error", { count: 1 }));
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{getBrowserInfo(userAgentInfo)}</CardTitle>
        {isCurrentSession && (
          <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            {t("currentSession")}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <SmartphoneIcon />
            ) : (
              <MonitorIcon />
            )}

            <div>
              <p className="text-sm text-muted-foreground">
                {tCommon("createdAt")}{" "}
                {formatDate({ date: session.createdAt, locale })}
              </p>
              <p className="text-sm text-muted-foreground">
                {tCommon("expireAt")}{" "}
                {formatDate({ date: session.expiresAt, locale })}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <Button
              variant={"destructive"}
              size={"sm"}
              onClick={() => handleRevokeSession(session)}
            >
              <LoadingSwap isLoading={isDeleting}>
                <Trash2 />
                <span className="max-sm:hidden">
                  {tRevoke("labelLong", { count: 1 })}
                </span>
              </LoadingSwap>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
