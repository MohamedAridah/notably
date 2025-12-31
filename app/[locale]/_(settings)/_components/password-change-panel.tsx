import PasswordChangeForm from "./forms/password-change-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PassworChangedPanel() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Change Paswword</CardTitle>
        <CardDescription>
          Update your password for improved security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordChangeForm />
      </CardContent>
    </Card>
  );
}
