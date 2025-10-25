"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingSwap from "@/components/utils/loading-swap";
import { authClient } from "@/lib/auth-client";
import { authSchema } from "@/validations/zod/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const EmailUpdateSchema = authSchema.pick({
  email: true,
});

export default function EmailUpdateForm({
  user,
  setIsOpen,
}: {
  user: { email: string };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof EmailUpdateSchema>>({
    defaultValues: user,
    resolver: zodResolver(EmailUpdateSchema),
  });

  const handleUpdateProfile = async (
    data: z.infer<typeof EmailUpdateSchema>
  ) => {
    if (data.email === user.email) {
      toast.error("Email is the same");
      return;
    }

    await authClient.changeEmail({
      newEmail: data.email,
      callbackURL: "/settings/profile",
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || "Failed to change your email.");
        },
        onSuccess: () => {
          toast.success("Email changed successfully", {
            description: "Please verify your new email to complete the change.",
          });
          setIsOpen(false);
        },
      },
    });
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleUpdateProfile)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="updated@mail.com"
                  className="placeholder:text-xs text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="rounded-md flex-5 flex-grow"
            disabled={isSubmitting}
          >
            <LoadingSwap isLoading={isSubmitting}>Change Email</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
