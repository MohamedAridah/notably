import { Session } from "better-auth";
import SessionCard from "./session-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import RevokeOtherSessionsButton from "./revoke-other-sessions-button";

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

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          This is a list of devices that have logged into your account. Revoke
          any sessions that you do not recognize.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentSession && (
            <SessionCard session={currentSession} isCurrentSession />
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Other Active Sessions</h3>
              {otherSessions.length > 0 && <RevokeOtherSessionsButton />}
            </div>

            {otherSessions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-muted-foreground text-center">
                  No other active sessions
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
