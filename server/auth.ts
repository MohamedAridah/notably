"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { mapErrorToCode } from "@/helpers/map-error-to-code";
import { ServerErrorCodes } from "@/helpers/server-error-codes";

interface SignUpUserParams {
  email: string;
  name: string;
  password: string;
}

interface SignInUserParams {
  email: string;
  password: string;
}

interface ForgotUserPasswordParams {
  email: string;
  redirectTo: string;
}

interface ResetUserPasswordParams {
  newPassword: string;
  token: string;
}

export const SignUpUser = async (data: SignUpUserParams) => {
  try {
    await auth.api.signUpEmail({
      body: { callbackURL: "/auth/sign-in", ...data },
    });

    return {
      success: true,
      code: ServerErrorCodes.AUTH.SUCCESS_SIGNUP_CHECK_EMAIL,
    };
  } catch (error) {
    console.log("Sign up Error: ", error);

    return {
      success: false,
      code: mapErrorToCode(error),
    };
  }
};

export const SignInUser = async (data: SignInUserParams) => {
  try {
    await auth.api.signInEmail({
      body: data,
      headers: await headers(),
    });

    return {
      success: true,
      code: ServerErrorCodes.AUTH.SUCCESS_SIGNIN,
    };
  } catch (error) {
    console.log("Log in Error: ", error);

    return {
      success: false,
      code: mapErrorToCode(error),
    };
  }
};

export const ForgotUserPassword = async (data: ForgotUserPasswordParams) => {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email: data.email,
        redirectTo: data.redirectTo,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.AUTH.SUCCESS_PASSWORD_RESET_EMAIL_SENT,
    };
  } catch (error) {
    console.log("Forgot Password Error: ", error);
    return {
      success: false,
      code: mapErrorToCode(error),
    };
  }
};

export const ResetUserPassword = async (data: ResetUserPasswordParams) => {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: data.newPassword,
        token: data.token,
      },
    });

    return {
      success: true,
      code: ServerErrorCodes.AUTH.SUCCESS_PASSWORD_RESET,
    };
  } catch (error) {
    console.log("Reset Password Error: ", error);

    return {
      success: false,
      code: mapErrorToCode(error),
    };
  }
};

export const isUserAuthed = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!user) {
    throw new Error("ERROR_NOT_AUTHENTICATED");
  }

  return user.id;
};
