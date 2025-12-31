"use server";

import { Prisma } from "@prisma/client";
import { prismaError } from "prisma-better-errors";

export default async function errorMessage(error: unknown): Promise<string> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return String(new prismaError(error));
  }
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
