"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Logout() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success("Signed out successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out");
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button variant="outline" onClick={handleLogout}>
      {isLoading ? (
        <div className="flex flex-items gap-2">
          <Loader2 className="animate-spin" />
          Logout
        </div>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
