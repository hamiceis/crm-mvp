import type { Session } from "next-auth";

export const isAdmin = (session: Session) => session.user.role === "ADMIN";
