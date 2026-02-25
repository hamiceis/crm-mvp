import type { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      companyId: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    companyId: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    companyId?: string;
    role?: Role;
  }
}
