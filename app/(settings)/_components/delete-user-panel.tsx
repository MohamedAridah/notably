import DeleteAccountAction from "./delete-account-button";
import PageHeader from "./page-header";

export default function DeleteUserPanel() {
  return (
    <div>
      <PageHeader title="Delete Account" className="text-destructive" />
      <p className="text-sm text-muted-foreground mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>

      <DeleteAccountAction />
    </div>
  );
}
