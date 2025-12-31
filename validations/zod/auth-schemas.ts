import { z } from "zod";

export const message = (key: string, params?: Record<string, unknown>) =>
  JSON.stringify({ key, ...params });

export const authSchema = z.object({
  email: z.email("email"),
  name: z.string().min(1, message("min", { count: 1 })),
  password: z.string().min(8, message("min", { count: 8 })),
  password__confirm: z.string().min(8, message("min", { count: 8 })),
});

export const SignUpSchema = authSchema.refine(
  (data) => data.password === data.password__confirm,
  {
    message: "passwordsMismatch",
    path: ["password__confirm"],
  }
);

export const SignInSchema = authSchema.pick({
  email: true,
  password: true,
});

export const ForgotPasswordSchema = authSchema.pick({
  email: true,
});

export const ResetPasswordSchema = authSchema
  .pick({
    password: true,
    password__confirm: true,
  })
  .refine((data) => data.password === data.password__confirm, {
    message: "passwordsMismatch",
    path: ["password__confirm"],
  });

export const ChangePasswordSchema = authSchema
  .pick({
    password: true,
    password__confirm: true,
  })
  .extend({
    password__new: z.string().min(8, message("min", { count: 8 })),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.password__new === data.password__confirm, {
    message: "passwordsMismatch",
    path: ["password__confirm"],
  });
