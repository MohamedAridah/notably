import ChangeAccountPassword from "./password-change-panel";
import DeleteAccountAction from "./delete-account-button";
import Panel from "./panel";

const UserActionsPanel = () => {
  return (
    <Panel title="Account Settings">
      <div className="flex items-center justify-between mb-4">
        <p className="">Change password</p>
        <ChangeAccountPassword />
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-red-500">Delete your account</p>
        <DeleteAccountAction />
      </div>
    </Panel>
  );
};

export default UserActionsPanel;
