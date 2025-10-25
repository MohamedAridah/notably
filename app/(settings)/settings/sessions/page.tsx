import { Metadata } from "next";
import PageHeader from "../../_components/page-header";
import SessionsPanel from "../../_components/sessions-panel";
import { Suspense } from "react";
import UserBioSkeleton from "../../_components/loading-states/user-bio-skeleton";

export const metadata: Metadata = {
  title: "Sessions",
};

export default function SessionsPage() {
  return (
    <>
      <PageHeader title="Sessions" />

      <Suspense fallback={<UserBioSkeleton />}>
        <SessionsPanel />
      </Suspense>
    </>
  );
}
