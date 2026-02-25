import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getRequestClientIp } from "@/lib/rate-limit";
import { toCents } from "@/lib/utils";
import { dealStages, defaultDealStage } from "@/lib/deal-stages";

const isSecretEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  dealTitle: z.string().min(2).optional(),
  dealValue: z.coerce.number().positive().optional(),
  stage: z.enum(dealStages).optional(),
});

export async function POST(request: NextRequest) {
  const expectedApiKey = process.env.INTEGRATION_API_KEY;
  const allowedCompanyId = process.env.INTEGRATION_COMPANY_ID;
  const sentCompanyId = request.headers.get("x-company-id");

  if (!expectedApiKey) {
    return NextResponse.json(
      { error: "INTEGRATION_API_KEY não configurada" },
      { status: 500 },
    );
  }

  const sentApiKey = request.headers.get("x-api-key");
  if (!sentApiKey || !isSecretEqual(sentApiKey, expectedApiKey)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!sentCompanyId) {
    return NextResponse.json(
      { error: "Header x-company-id é obrigatório" },
      { status: 400 },
    );
  }

  if (allowedCompanyId && sentCompanyId !== allowedCompanyId) {
    return NextResponse.json(
      { error: "Company não autorizada para esta chave" },
      { status: 401 },
    );
  }

  const clientIp = getRequestClientIp(request);
  const limit = consumeRateLimit({
    key: `api:lead:${clientIp}:${sentCompanyId}`,
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em instantes." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const company = await prisma.company.findUnique({
    where: { id: sentCompanyId },
    select: { id: true },
  });

  if (!company) {
    return NextResponse.json({ error: "Company inválida" }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const contact = await tx.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        company: parsed.data.company || null,
        source: parsed.data.source || "API Integration",
        companyId: company.id,
      },
    });

    let dealId: string | null = null;
    if (parsed.data.dealTitle) {
      const deal = await tx.deal.create({
        data: {
          title: parsed.data.dealTitle,
          value: toCents(parsed.data.dealValue || 0),
          stage: parsed.data.stage ?? defaultDealStage,
          companyId: company.id,
          contactId: contact.id,
        },
      });
      dealId = deal.id;
    }

    return { contactId: contact.id, dealId };
  });

  return NextResponse.json(
    {
      ok: true,
      contactId: result.contactId,
      dealId: result.dealId,
    },
    { status: 201 },
  );
}
