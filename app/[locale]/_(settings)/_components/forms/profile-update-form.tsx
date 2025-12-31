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

const ProfileUpdateSchema = authSchema.pick({
  name: true,
});

export default function ProfileUpdateForm({
  user,
  setIsOpen,
}: {
  user: { name: string };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    defaultValues: user,
    resolver: zodResolver(ProfileUpdateSchema),
  });

  const handleUpdateProfile = async (
    data: z.infer<typeof ProfileUpdateSchema>
  ) => {
    await authClient.updateUser({
      name: data.name,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || "Failed to update profile.");
        },
        onSuccess: () => {
          toast.success("Profile updates successfully");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Updated username"
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
            <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
