import { mapBetterAuthError } from "@/helpers/map-better-auth-error";
import { mapPrismaError } from "@/helpers/map-prisma-error";
import { ServerErrorCodes } from "@/helpers/server-error-codes";

/**
 * Maps internal errors to stable server error codes.
 */
export function mapErrorToCode(error: unknown): string {
  /* ---------------- Prisma errors ---------------- */
  const prismaCode = mapPrismaError(error);
  if (prismaCode) return prismaCode;

  /* ---------------- Better Auth errors ---------------- */
  const authCode = mapBetterAuthError(error);
  if (authCode) return authCode;

  /* ---------------- Business / Custom errors ---------------- */
  if (error instanceof Error) {
    switch (error.message) {
      case "ERROR_NOT_AUTHENTICATED":
        return ServerErrorCodes.AUTH.NOT_AUTHENTICATED;
      default:
        return ServerErrorCodes.AUTH.UNKNOWN;
    }
  }

  /* ---------------- Fallback ---------------- */
  return ServerErrorCodes.AUTH.UNKNOWN;
}
