"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useLogout from "@/hooks/use-logout";

export default function Logout() {
  const { handleLogout, isLoading } = useLogout();

  return (
    <Button variant="outline" onClick={handleLogout}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" /> Logout
        </>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
