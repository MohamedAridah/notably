"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { ResetUserPassword } from "@/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/validations/zod/auth-schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      password__confirm: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  if (!token)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <ShieldAlert className="text-center size-10 mx-auto mb-3 text-orange-400" />
          <CardDescription>
            No token provided. Please check the URL or contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    const { success, message } = await ResetUserPassword({
      newPassword: data.password,
      token,
    });

    if (success) {
      form.reset();
      toast.success(message);
      replace("/auth/sign-in");
      return;
    }
    toast.error(message || "Failed to send reset password link.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Please enter your new password below. Make sure it meets the
          requirements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password__confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-[15px]">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
