import prisma from "@/lib/prisma";
import sendEmail from "@/lib/sendEmail";
import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import VerifyEmail from "@/emails/verify-email";
import ResetPassword from "@/emails/reset-password";
import { createDefaultNotebook } from "@/lib/db/notebooks";
import VerifyUpdatedEmail from "@/emails/verify-updated-email";
import DeleteAccount from "@/emails/delete-account";
import WelcomeEmail from "@/emails/welcome-email";

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          template: VerifyUpdatedEmail({
            username: user.name,
            verificationUrl: url,
          }),
        });
      },
    },

    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Delete your account",
          template: DeleteAccount({
            username: user.name,
            deleteAccountUrl: url,
          }),
        });
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/auth/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };

        if (user != null) {
          await sendEmail({
            to: user.email,
            subject: "Welcome to Notably!",
            template: WelcomeEmail({
              username: user.name,
              homeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            }),
          });
        }
      }
    }),
  },

  databaseHooks: {
    account: {
      create: {
        after: async (account) => {
          //create a default notebook for the user
          await createDefaultNotebook(account.userId);
        },
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minute cache
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

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
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        template: VerifyEmail({ username: user.name, verificationUrl: url }),
      });
    },
  },

  plugins: [nextCookies()],
});
