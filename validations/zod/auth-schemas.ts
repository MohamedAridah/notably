import z from "zod";

export const authSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Too small: expected string to have >=1 characters"),
  password: z
    .string()
    .min(8, "Too small: expected string to have >=8 characters"),
  password__confirm: z
    .string()
    .min(8, "Too small: expected string to have >=8 characters"),
});

export const SignUpSchema = authSchema
  .pick({
    email: true,
    name: true,
    password: true,
    password__confirm: true,
  })
  .refine((data) => data.password == data.password__confirm, {
    message: "Passwords do not match",
    path: ["password__confirm"],
  });

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
  .refine((data) => data.password == data.password__confirm, {
    message: "Passwords do not match",
    path: ["password__confirm"],
  });
