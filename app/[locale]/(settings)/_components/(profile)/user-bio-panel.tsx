"use client";

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import Panel from "@/app/[locale]/(settings)/_components/panel";
import UserBioSkeleton from "@/app/[locale]/(settings)/_components/(skeletons)/user-bio-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { Camera, CheckCircle2Icon } from "lucide-react";

export default function UserBioPanel() {
  const t = useTranslations("ProfilePage.bioPanel");
  const { data: session, isPending } = authClient.useSession();
  const person = session?.user;

  if (isPending) {
    return <UserBioSkeleton />;
  }

  return (
    <Panel>
      <div className="flex flex-row items-center gap-5 ">
        <div className="group relative ">
          <Image
            src="https://dummyjson.com/icon/michaelw/128"
            alt={`${person?.name} profile photo`}
            width={100}
            height={100}
            className=" max-w-[100px] rounded-full shadow-md overflow-hidden group-hover:cursor-pointer"
          />
          <div className="absolute bottom-0 right-0 -translate-y-2 translate-x-1/3 rounded-full bg-white dark:bg-slate-200 p-1 flex items-center justify-center">
            <Camera
              size={20}
              className="shadow-sm group-hover:cursor-pointer dark:text-black"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{person?.name}</h3>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            {person?.email}
            <Tooltip>
              <TooltipTrigger>
                {person?.emailVerified && (
                  <CheckCircle2Icon className="size-4 text-green-400" />
                )}
                <TooltipContent side="bottom">
                  {t("emailIsVerified")}
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </p>
        </div>
      </div>
    </Panel>
  );
}
