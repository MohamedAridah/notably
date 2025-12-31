import { Prisma } from "@prisma/client";
import { prismaError } from "prisma-better-errors";
import { ServerErrorCodes } from "@/helpers/server-error-codes";

export const mapPrismaError = (error: unknown): string | null => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // Unique constraint failed
        return ServerErrorCodes.AUTH.EMAIL_EXISTS;
      default:
        return ServerErrorCodes.AUTH.DATABASE;
    }
  }

  return null; // Not a Prisma error
};
