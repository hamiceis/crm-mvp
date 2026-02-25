import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, resetRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const emailKey = parsed.data.email.trim().toLowerCase();
        const limiter = consumeRateLimit({
          key: `login:${emailKey}`,
          limit: 5,
          windowMs: 10 * 60 * 1000,
        });
        if (!limiter.allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!isValid) {
          return null;
        }

        resetRateLimit(`login:${emailKey}`);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          companyId: user.companyId,
          role: user.role as "ADMIN" | "SALES",
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        if ("companyId" in user && typeof user.companyId === "string") {
          token.companyId = user.companyId;
        }
        if ("role" in user && typeof user.role === "string") {
          token.role = user.role;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.companyId =
          typeof token.companyId === "string" ? token.companyId : "";
        session.user.role =
          token.role === "ADMIN" || token.role === "SALES"
            ? token.role
            : "SALES";
      }
      return session;
    },
  },
});
