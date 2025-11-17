"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSwap from "@/components/utils/loading-swap";
import PasswordInput from "@/components/utils/password-input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PasswordRole = z
  .string()
  .min(8, "Too small: expected string to have >=8 characters");

const PasswordChangeSchema = z
  .object({
    currentPassword: PasswordRole,
    newPassword: PasswordRole,
    confirmPassword: PasswordRole,
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function PasswordChangeForm() {
  const form = useForm<z.infer<typeof PasswordChangeSchema>>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    },
    resolver: zodResolver(PasswordChangeSchema),
  });

  const handlePasswordChange = async (
    data: z.infer<typeof PasswordChangeSchema>
  ) => {
    await authClient.changePassword(data, {
      onError: ({ error }) => {
        toast.error(error.message || "Failed to change password.");
      },
      onSuccess: () => {
        toast.success("Password changed successfully");
        form.reset();
      },
    });
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handlePasswordChange)}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Current password..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="New password..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Confirm new password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="revokeOtherSessions"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 hover:cursor-pointer">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Log out other sessions</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="w-full mt-5"
        >
          <LoadingSwap isLoading={isSubmitting}>Change Password</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
