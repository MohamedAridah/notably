import { getUserSessions } from "@/server/sessions";
import SessionManagement from "@/app/[locale]/(settings)/_components/(sessions)/session-management";

export default async function SessionsPanel() {
  const { sessions, session } = await getUserSessions();

  const currentSessionToken = session?.session.token;

  return (
    <SessionManagement
      sessions={sessions}
      currentSessionToken={currentSessionToken as string}
    />
  );
}
