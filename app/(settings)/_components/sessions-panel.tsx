import SessionManagement from "./sessions/session-management";
import { getUserSessions } from "@/server/sessions";

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
