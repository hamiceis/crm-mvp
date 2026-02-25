"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(80),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "password_mismatch",
    path: ["confirmPassword"],
  });

const updatePreferencesSchema = z.object({
  timezone: z.string().min(3).max(80),
  dateFormat: z.enum(["pt-BR", "en-US"]),
  themePreference: z.enum(["light", "dark", "system"]),
  whatsappReminders: z.enum(["on", "off"]).optional(),
});

export async function updateProfileAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    redirect("/dashboard/settings?toast=invalid_profile");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE",
    entity: "USER_PROFILE",
    entityId: session.user.id,
    metadata: { name: parsed.data.name },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?toast=profile_updated");
}

export async function changePasswordAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const mismatch = parsed.error.issues.some(
      (issue) => issue.message === "password_mismatch",
    );
    redirect(
      `/dashboard/settings?toast=${mismatch ? "password_mismatch" : "invalid_password"}`,
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/dashboard/settings?toast=invalid_password");
  }

  const validCurrent = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!validCurrent) {
    redirect("/dashboard/settings?toast=wrong_password");
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newHash },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE",
    entity: "USER_PASSWORD",
    entityId: session.user.id,
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?toast=password_updated");
}

export async function updatePreferencesAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);

  const parsed = updatePreferencesSchema.safeParse({
    timezone: formData.get("timezone"),
    dateFormat: formData.get("dateFormat"),
    themePreference: formData.get("themePreference"),
    whatsappReminders: formData.get("whatsappReminders"),
  });

  if (!parsed.success) {
    redirect("/dashboard/settings?toast=invalid_preferences");
  }

  const data = {
    timezone: parsed.data.timezone,
    dateFormat: parsed.data.dateFormat,
    themePreference: parsed.data.themePreference,
    whatsappReminders: parsed.data.whatsappReminders === "on",
  };

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data,
    },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE",
    entity: "USER_SETTINGS",
    entityId: session.user.id,
    metadata: data,
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?toast=preferences_updated");
}
