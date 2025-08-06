import { Prisma } from "@prisma/client";
import { prismaError } from "prisma-better-errors";

export default function errorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return String(new prismaError(error));
  }
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
