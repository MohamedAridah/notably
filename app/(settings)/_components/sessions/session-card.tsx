"use client";

import { UAParser } from "ua-parser-js";
import { Session } from "better-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getBrowserInfo } from "../utils/utils";
import { MonitorIcon, SmartphoneIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import LoadingSwap from "@/components/utils/loading-swap";
import { useRouter } from "next/navigation";

interface SessionCardType {
  session: Session;
  isCurrentSession?: boolean;
}

export default function SessionCard({
  session,
  isCurrentSession = false,
}: SessionCardType) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const handleRevokeSession = async (session: Session) => {
    try {
      setIsDeletingSession(true);

      return await authClient.revokeSession({
        token: session.token,
        fetchOptions: {
          onError: ({ error }) => {
            toast.error(error.message || "Failed to exit the session");
          },
          onSuccess: () => {
            toast.success("Session Revoked successfully ");
            router.refresh();
          },
        },
      });
    } catch (error) {
      const e = error as Error;
      toast.error(e.message || "Failed to exit the session");
    } finally {
      setIsDeletingSession(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{getBrowserInfo(userAgentInfo)}</CardTitle>
        {isCurrentSession && (
          <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            Current Session
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
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <Button
              variant={"destructive"}
              size={"sm"}
              onClick={() => handleRevokeSession(session)}
            >
              <LoadingSwap isLoading={isDeletingSession}>
                <Trash2 />
                <span className="max-sm:hidden">Revoke Session</span>
              </LoadingSwap>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
