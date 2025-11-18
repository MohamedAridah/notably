import UserBioPanel from "../../_components/user-bio-panel";
import UserInfoPanel from "../../_components/user-info-panel";
import PageHeader from "../../_components/page-header";
import { Suspense } from "react";

export const metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Public Profile" />

      <Suspense fallback="Loading">
        <UserBioPanel />
      </Suspense>
      <Suspense fallback="Loading">
        <UserInfoPanel />
      </Suspense>
    </>
  );
}
