"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { toCents } from "@/lib/utils";
import { dealStages, type DealStage } from "@/lib/deal-stages";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
});

const dealSchema = z.object({
  title: z.string().min(2),
  value: z.coerce.number().positive(),
  stage: z.enum(dealStages),
});

export async function createContactAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    source: formData.get("source"),
  });

  if (!parsed.success) {
    redirect("/dashboard/contacts?toast=invalid_create");
  }

  const created = await prisma.contact.create({
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
      companyId: session.user.companyId,
      ownerUserId: session.user.id,
    },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "CREATE",
    entity: "CONTACT",
    entityId: created.id,
    metadata: { name: created.name, source: created.source },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contacts");
  redirect("/dashboard/contacts?toast=created");
}

export async function createDealAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "SALES"]);
  const parsed = dealSchema.safeParse({
    title: formData.get("title"),
    value: formData.get("value"),
    stage: formData.get("stage"),
  });

  if (!parsed.success) {
    redirect("/dashboard/deals?toast=invalid_create");
  }

  const created = await prisma.deal.create({
    data: {
      title: parsed.data.title,
      value: toCents(parsed.data.value),
      stage: parsed.data.stage,
      companyId: session.user.companyId,
      ownerUserId: session.user.id,
    },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "CREATE",
    entity: "DEAL",
    entityId: created.id,
    metadata: {
      title: created.title,
      stage: created.stage,
      valueInCents: created.value,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  redirect("/dashboard/deals?toast=created");
}

export async function updateDealStageAction(dealId: string, stage: DealStage) {
  const session = await requireRole(["ADMIN", "SALES"]);

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!deal || deal.companyId !== session.user.companyId) {
    throw new Error("Deal not found or unauthorized");
  }

  const updated = await prisma.deal.update({
    where: { id: dealId },
    data: { stage },
  });

  createAuditLog({
    companyId: session.user.companyId,
    userId: session.user.id,
    action: "UPDATE_STAGE",
    entity: "DEAL",
    entityId: updated.id,
    metadata: { title: updated.title, newStage: updated.stage },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  return updated;
}
