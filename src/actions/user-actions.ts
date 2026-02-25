"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "SALES"]),
});

export async function createUserAction(formData: FormData) {
  const session = await requireRole(["ADMIN"]);

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/dashboard/settings/users?toast=invalid_user");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    redirect("/dashboard/settings/users?toast=email_taken");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const created = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      companyId: session.user.companyId,
    },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "CREATE",
    entity: "USER",
    entityId: created.id,
    metadata: { role: created.role, email: created.email },
  });

  revalidatePath("/dashboard/settings/users");
  redirect("/dashboard/settings/users?toast=user_created");
}
