"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LayoutDashboard,
  Loader2,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import useLogout from "@/hooks/use-logout";
import { Skeleton } from "@/components/ui/skeleton";
import { type User } from "better-auth";
import React from "react";
import Link from "next/link";

type UserType = {
  user: Pick<User, "name" | "email" | "image">;
};

export function UserForNav() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
    );
  }

  if (!session?.session.userId) {
    return null;
  }

  const user = session.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvarat user={user} />
              <UserInfo user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvarat user={user} />
                <UserInfo user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <UserMenu />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function UserAsIcon() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!session?.session.userId) {
    return null;
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:cursor-pointer">
        <UserAvarat user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <UserMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UserAvarat = ({ user }: UserType) => {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={user.image ?? ""} alt={user.name} />
      <AvatarFallback className="rounded-lg">
        {user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

const UserInfo = ({ user }: UserType) => {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">{user.email}</span>
    </div>
  );
};

const UserMenu = () => {
  const { handleLogout, isLoading: isLoggingout } = useLogout();

  return (
    <>
      <DropdownMenuItem asChild>
        <Link href="/dashboard">
          <LayoutDashboard />
          Dashboard
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem disabled>
        <BadgeCheck />
        Account
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={handleLogout}>
        {isLoggingout ? <Loader2 className="animate-spin" /> : <LogOut />}
        Log out
      </DropdownMenuItem>
    </>
  );
};
