import { Session } from "better-auth";
import SessionCard from "@/app/[locale]/(settings)/_components/(sessions)//session-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import RevokeOtherSessionsButton from "@/app/[locale]/(settings)/_components/(sessions)/revoke-other-sessions-button";
import { getTranslations } from "next-intl/server";

interface SessionManagementType {
  sessions: Session[];
  currentSessionToken: string;
}

export default async function SessionManagement({
  sessions,
  currentSessionToken,
}: SessionManagementType) {
  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  const t = await getTranslations("SessionsPage.sessionManagement");

  return (
    <Card>
      <CardHeader className="max-sm:px-3.5">
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="max-sm:px-3.5">
        <div className="space-y-6">
          {currentSession && (
            <SessionCard session={currentSession} isCurrentSession />
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{t("otherSessionsTitle")}</h3>
              {otherSessions.length > 0 && <RevokeOtherSessionsButton />}
            </div>

            {otherSessions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-muted-foreground text-center">
                  {t("noSessions")}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {otherSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
