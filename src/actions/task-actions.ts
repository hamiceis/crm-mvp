"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { parseDateInput } from "@/lib/date";
import { createAuditLog } from "@/lib/audit";
import { isAdmin } from "@/lib/access-scope";

const createTaskSchema = z.object({
  title: z.string().min(2),
  note: z.string().optional(),
  dueAt: z
    .string()
    .optional()
    .transform((value) => parseDateInput(value)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  note: z.string().optional(),
  dueAt: z
    .string()
    .optional()
    .transform((value) => parseDateInput(value)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

async function getTaskForUpdate(
  taskId: string,
  companyId: string,
  userId: string,
  admin: boolean,
) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      companyId,
      ...(admin ? {} : { assignedToId: userId }),
    },
  });
}

export async function createTaskAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);

  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    note: formData.get("note") || undefined,
    dueAt: formData.get("dueAt") || undefined,
    priority: formData.get("priority") || "MEDIUM",
  });

  if (!parsed.success) {
    redirect("/dashboard/tasks?toast=invalid_create");
  }

  const created = await prisma.task.create({
    data: {
      title: parsed.data.title,
      note: parsed.data.note || null,
      dueAt: parsed.data.dueAt,
      priority: parsed.data.priority,
      status: "OPEN",
      companyId: session.user.companyId,
      assignedToId: session.user.id,
    },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "CREATE",
    entity: "TASK",
    entityId: created.id,
    metadata: {
      title: created.title,
      priority: created.priority,
      dueAt: created.dueAt?.toISOString() ?? null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  redirect("/dashboard/tasks?toast=created");
}

export async function completeTaskAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);
  const id = String(formData.get("id") || "");

  if (!id) redirect("/dashboard/tasks?toast=invalid_update");

  const admin = isAdmin(session);
  const task = await getTaskForUpdate(
    id,
    session.user.companyId,
    session.user.id,
    admin,
  );
  if (!task) {
    redirect("/dashboard/tasks?toast=forbidden_task");
  }

  await prisma.task.update({
    where: { id: task.id },
    data: { status: "DONE" },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE",
    entity: "TASK",
    entityId: task.id,
    metadata: { status: "DONE" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  redirect("/dashboard/tasks?toast=completed");
}

export async function reopenTaskAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);
  const id = String(formData.get("id") || "");

  if (!id) redirect("/dashboard/tasks?toast=invalid_update");

  const admin = isAdmin(session);
  const task = await getTaskForUpdate(
    id,
    session.user.companyId,
    session.user.id,
    admin,
  );
  if (!task) {
    redirect("/dashboard/tasks?toast=forbidden_task");
  }

  await prisma.task.update({
    where: { id: task.id },
    data: { status: "OPEN" },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE",
    entity: "TASK",
    entityId: task.id,
    metadata: { status: "OPEN" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  redirect("/dashboard/tasks?toast=reopened");
}

export async function updateTaskAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);

  const parsed = updateTaskSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    note: formData.get("note") || undefined,
    dueAt: formData.get("dueAt") || undefined,
    priority: formData.get("priority") || "MEDIUM",
  });

  if (!parsed.success) {
    redirect("/dashboard/tasks?toast=invalid_update");
  }

  const admin = isAdmin(session);
  const task = await getTaskForUpdate(
    parsed.data.id,
    session.user.companyId,
    session.user.id,
    admin,
  );
  if (!task) {
    redirect("/dashboard/tasks?toast=forbidden_task");
  }

  await prisma.task.update({
    where: { id: task.id },
    data: {
      title: parsed.data.title,
      note: parsed.data.note || null,
      dueAt: parsed.data.dueAt,
      priority: parsed.data.priority,
    },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE",
    entity: "TASK",
    entityId: task.id,
    metadata: {
      title: parsed.data.title,
      priority: parsed.data.priority,
      dueAt: parsed.data.dueAt?.toISOString() ?? null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  redirect("/dashboard/tasks?toast=updated");
}

export async function deleteTaskAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);
  const id = String(formData.get("id") || "");

  if (!id) redirect("/dashboard/tasks?toast=invalid_update");

  const admin = isAdmin(session);
  const task = await getTaskForUpdate(
    id,
    session.user.companyId,
    session.user.id,
    admin,
  );
  if (!task) {
    redirect("/dashboard/tasks?toast=forbidden_task");
  }

  await prisma.task.delete({
    where: { id: task.id },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "DELETE",
    entity: "TASK",
    entityId: task.id,
    metadata: { title: task.title },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  redirect("/dashboard/tasks?toast=deleted");
}
