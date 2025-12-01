"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import errorMessage from "@/helpers/errorMessage";

interface SignUpUserParams {
  email: string;
  name: string;
  password: string;
}

interface SignInUserParams {
  email: string;
  password: string;
}

export const SignUpUser = async (data: SignUpUserParams) => {
  try {
    await auth.api.signUpEmail({
      body: { callbackURL: "/auth/sign-in", ...data },
    });
    return {
      success: true,
      message: "Please check your email for verification.",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
};

export const SignInUser = async (data: SignInUserParams) => {
  try {
    await auth.api.signInEmail({ body: data, headers: await headers() });
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
};

interface ForgrotUserPasswordParams {
  email: string;
  redirectTo: string;
}

export const ForgotUserPassword = async (data: ForgrotUserPasswordParams) => {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email: data.email,
        redirectTo: data.redirectTo,
      },
    });
    return {
      success: true,
      message: "Please check your email for a password reset link.",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
};

interface ResetUserPasswordParams {
  newPassword: string;
  token: string;
}

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
      message: "Password reset successfully. You can now sign in.",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
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
    throw new Error("User not authenticated");
  }

  return user.id;
};
