import { Metadata } from "next";
import DeleteUserPanel from "../../_components/delete-user-panel";
import PageHeader from "../../_components/page-header";
import PassworChangedPanel from "../../_components/password-change-panel";

export const metadata: Metadata = {
  title: "Security",
};

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security" />

      <div className="space-y-10">
        <PassworChangedPanel />
        <DeleteUserPanel />
      </div>
    </>
  );
}
