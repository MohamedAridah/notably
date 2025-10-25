import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteAccountAction from "./delete-account-button";

export default function DeleteUserPanel() {
  return (
    <Card className="border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <DeleteAccountAction />
      </CardContent>
    </Card>
  );
}
