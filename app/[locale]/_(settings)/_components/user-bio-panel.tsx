"use client";

import Image from "next/image";

import { authClient } from "@/lib/auth-client";

import Panel from "./panel";
import UserBioSkeleton from "./loading-states/user-bio-skeleton";

import { Camera, CheckCircle2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserBioPanel = () => {
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
            src="https://avatars.githubusercontent.com/u/91488128?v=4"
            // src="https://dummyjson.com/icon/michaelw/128"
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
            {person?.email}{" "}
            <Tooltip>
              <TooltipTrigger>
                {person?.emailVerified && (
                  <CheckCircle2Icon className="size-4 text-green-400" />
                )}
                <TooltipContent side="bottom">
                  Email is verified.
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </p>
        </div>
      </div>
    </Panel>
  );
};

export default UserBioPanel;
