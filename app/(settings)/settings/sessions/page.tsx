import PageHeader from "../../_components/page-header";
import SessionsPanel from "../../_components/sessions-panel";
import { Suspense } from "react";
import UserBioSkeleton from "../../_components/loading-states/user-bio-skeleton";

export const metadata = {
  title: "Sessions",
};

export default function SessionsPage() {
  return (
    <>
      <PageHeader title="Sessions" />

      <Suspense
        fallback={Array(3)
          .fill(null)
          .map((_, index) => (
            <UserBioSkeleton key={index} />
          ))}
      >
        <SessionsPanel />
      </Suspense>
    </>
  );
}
