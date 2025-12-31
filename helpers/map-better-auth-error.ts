import { ServerErrorCodes } from "@/helpers/server-error-codes";

export const mapBetterAuthError = (error: unknown): string | null => {
  const e = error as { statusCode?: number; status?: number; message?: string };

  if (e.statusCode === 401 || e.status === 401) {
    return ServerErrorCodes.AUTH.INVALID_CREDENTIALS;
  }
  if (e.statusCode === 422 || e.status === 422) {
    return ServerErrorCodes.AUTH.EMAIL_EXISTS;
  }
  if (e.statusCode === 400 || e.status === 400) {
    return ServerErrorCodes.AUTH.INVALID_TOKEN;
  }
  if (e.statusCode === 500 || e.status === 500) {
    return ServerErrorCodes.AUTH.SERVER_ERROR;
  }

  return null; // Couldn’t determine code
};
