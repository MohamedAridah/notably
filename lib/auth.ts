import prisma from "@/lib/prisma";
import sendEmail from "@/lib/sendEmail";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import VerifyEmail from "@/emails/verify-email";
import ResetPassword from "@/emails/reset-password";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        template: ResetPassword({
          username: user.name,
          resetPasswordUrl: url,
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        template: VerifyEmail({ username: user.name, verificationUrl: url }),
      });
    },
    sendOnSignUp: true,
  },
  plugins: [nextCookies()],
});
