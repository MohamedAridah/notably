"use server";

import { auth } from "@/lib/auth";
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
    await auth.api.signUpEmail({ body: { callbackURL: "/sign-in", ...data } });
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
    await auth.api.signInEmail({ body: data });
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
