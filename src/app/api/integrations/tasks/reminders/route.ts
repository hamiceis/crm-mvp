import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { consumeRateLimit, getRequestClientIp } from "@/lib/rate-limit";
import { runOverdueTaskReminders } from "@/lib/task-reminders";

const isSecretEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

export async function POST(request: NextRequest) {
  const expectedRunKey = process.env.REMINDER_RUN_KEY;
  const sentRunKey = request.headers.get("x-run-key");
  const companyId = request.headers.get("x-company-id");

  if (!expectedRunKey) {
    return NextResponse.json(
      { error: "REMINDER_RUN_KEY não configurada" },
      { status: 500 },
    );
  }

  if (!sentRunKey || !isSecretEqual(sentRunKey, expectedRunKey)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!companyId) {
    return NextResponse.json(
      { error: "Header x-company-id é obrigatório" },
      { status: 400 },
    );
  }

  const clientIp = getRequestClientIp(request);
  const limit = consumeRateLimit({
    key: `api:reminders:${clientIp}:${companyId}`,
    limit: 12,
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

  const result = await runOverdueTaskReminders(companyId);
  const status = result.ok ? 200 : 500;

  return NextResponse.json(result, { status });
}
