import { logoutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" className="font-medium">
        Sair
      </Button>
    </form>
  );
}
