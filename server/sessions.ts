"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getUserSessions = async () => {
  const headersList = await headers();

  const response = await Promise.all([
    auth.api.listSessions({ headers: headersList }),
    auth.api.getSession({ headers: headersList }),
  ]);

  return {
    sessions: response[0],
    session: response[1],
  };
};
