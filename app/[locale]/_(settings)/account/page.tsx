import { Suspense } from "react";
import PassworChangedPanel from "../_components/password-change-panel";
import UserBioPanel from "../_components/user-bio-panel";
import UserInfoPanel from "../_components/user-info-panel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  KeyIcon,
  ShieldIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import SessionsPanel from "../_components/sessions-panel";
import DeleteUserPanel from "../_components/delete-user-panel";

export default function Account() {
  return (
    <section>
      <h1 className="font-semibold text-lg">My Profile</h1>
      <Tabs
        className="flex gap-3 max-sm:flex-col flex-row-reverse my-5"
        defaultValue="profile"
      >
        <div className="sm:flex-2/12 w-full">
          <TabsList className="flex sm:flex-col w-full space-y-1">
            <TabsTrigger value="profile">
              <UserIcon />
              <span className="max-sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <ShieldIcon />
              <span className="max-sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <KeyIcon />
              <span className="max-sm:hidden">Sessions</span>
            </TabsTrigger>
            {/* <TabsTrigger value="accounts">
              <LinkIcon />
              <span className="max-sm:hidden">Accounts</span>
            </TabsTrigger> */}
            <TabsTrigger value="danger">
              <Trash2Icon />
              <span className="max-sm:hidden">Danger</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="sm:flex-9/12 w-full">
          <TabsContent value="profile" className="[&_div]:last-of-type:mb-0!">
            <UserBioPanel />
            <UserInfoPanel />
          </TabsContent>
          <TabsContent value="security" className="[&_div]:last-of-type:mb-0!">
            <Suspense fallback="loading">
              <PassworChangedPanel />
            </Suspense>
          </TabsContent>
          <TabsContent value="sessions" className="[&_div]:last-of-type:mb-0!">
            <Suspense fallback="loading">
              <SessionsPanel />
            </Suspense>
          </TabsContent>
          <TabsContent value="danger" className="[&_div]:last-of-type:mb-0!">
            <DeleteUserPanel />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
