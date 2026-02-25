import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AppRole = Role;

export type RequiredSessionData = {
  userId: string;
  companyId: string;
  role: Role;
  isAdmin: boolean;
};

export const getRequiredSession = async () => {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized");
  }
  return session;
};

/**
 * For pages — redirects to /login instead of throwing.
 * Returns fully typed data without `as` assertions.
 */
export const getRequiredSessionData =
  async (): Promise<RequiredSessionData> => {
    const session = await auth();

    if (!session?.user?.id || !session.user.companyId) {
      redirect("/login");
    }

    return {
      userId: session.user.id,
      companyId: session.user.companyId,
      role: session.user.role,
      isAdmin: session.user.role === "ADMIN",
    };
  };

export const requireRole = async (roles: AppRole[]) => {
  const session = await getRequiredSession();

  if (!roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
};
