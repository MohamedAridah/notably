"use client";

import React from "react";
import Link from "next/link";
import { type User } from "better-auth";
import { authClient } from "@/lib/auth-client";
import useLogout from "@/hooks/use-logout";
import { useLocale, useTranslations } from "next-intl";
import { isLocaleRtl } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  BadgeCheck,
  ChevronsUpDown,
  LayoutDashboardIcon,
  Loader2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserType = {
  user: Pick<User, "name" | "email" | "image">;
};

interface UserMenuLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const DefaulytUserMenuLinks: UserMenuLink[] = [
  {
    href: "/dashboard",
    label: "dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    href: "/settings/profile",
    label: "account",
    icon: <BadgeCheck />,
  },
];

export function UserForNav({ links }: { links?: UserMenuLink[] }) {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const locale = useLocale();
  const isRtl = isLocaleRtl(locale);

  if (isPending) {
    return <UserForNavSkeleton />;
  }

  if (!session?.session.userId) {
    return null;
  }

  const user = session.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
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
            align={isRtl ? "start" : "end"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex rtl:flex-row-reverse items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvarat user={user} />
                <UserInfo user={user} className="text-end"/>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <UserMenu links={links} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function UserAsIcon({
  links,
  asModal = false,
}: {
  links?: UserMenuLink[];
  asModal?: boolean;
}) {
  const { data: session, isPending } = authClient.useSession();
  const locale = useLocale();
  const isRtl = isLocaleRtl(locale);

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!session?.session.userId) {
    return null;
  }

  const user = session.user;

  return (
    <DropdownMenu modal={asModal}>
      <DropdownMenuTrigger className="hover:cursor-pointer">
        <UserAvarat user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg"
        align={isRtl ? "start" : "end"}
        sideOffset={4}
      >
        <UserMenu links={links} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/*
  User menu component.
  return user menu items.
*/
const UserMenu = ({ links }: { links?: UserMenuLink[] }) => {
  const { handleLogout, isLoading: isLoggingout } = useLogout();
  const t = useTranslations("UserMenu");

  const hasExtraLinks = links && links.length > 0;

  return (
    <>
      {hasExtraLinks &&
        links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} className="rtl:flex-row-reverse">
              {link.icon}
              {t(link.label)}
            </Link>
          </DropdownMenuItem>
        ))}

      {DefaulytUserMenuLinks.map((link) => (
        <DropdownMenuItem key={link.href} asChild>
          <Link href={link.href} className="rtl:flex-row-reverse">
            {link.icon}
            {t(link.label)}
          </Link>
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={handleLogout} className="rtl:flex-row-reverse">
        {isLoggingout ? <Loader2 className="animate-spin" /> : <LogOut />}
        {t("logout")}
      </DropdownMenuItem>
    </>
  );
};

/*
  User Avatar component.
  return user's Image or First Letter of name.
*/
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

/*
  User information component.
  return user's name and email.
*/
const UserInfo = ({
  user,
  ...props
}: React.ComponentProps<"div"> & UserType) => {
  return (
    <div
      className={cn(
        "grid flex-1 text-start text-sm leading-tight",
        props.className
      )}
    >
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">{user.email}</span>
    </div>
  );
};

/*
  User skeleton component.
  renders skeleton for user avatar and name.
*/
const UserForNavSkeleton = () => {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-[100px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  );
};
