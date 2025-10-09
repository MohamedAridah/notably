"use client";

import Link from "next/link";
import z from "zod";
import { useRouter } from "next/navigation";
import { SignUpUser } from "@/server/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/validations/zod/auth-schemas";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, StarsIcon } from "lucide-react";

export default function SignUpForm() {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password__confirm: "",
    },
  });
  const { replace } = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    const { success, message } = await SignUpUser(data);
    if (success) {
      form.reset();
      toast.success("Signed up successfully", {
        description: message,
      });
      replace("/verify?process=email-verification&value=" + data.email);
      return;
    }
    toast.error(message);
  };
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Join our community to get access to our features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="someone@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      autoComplete="off"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="********"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Sign up"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={true}
              >
                Login with Google
                <Badge variant="outline" className="flex items-center">
                  <StarsIcon /> soon
                </Badge>
              </Button>
            </div>
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
