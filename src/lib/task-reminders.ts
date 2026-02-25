import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/date";

export type ReminderRunResult = {
  ok: boolean;
  scanned: number;
  sent: number;
  failed: number;
  skipped: number;
  message?: string;
};

async function sendWhatsAppMessage(params: {
  token: string;
  phoneNumberId: string;
  to: string;
  text: string;
}) {
  const response = await fetch(`https://graph.facebook.com/v21.0/${params.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "text",
      text: { body: params.text }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WhatsApp API ${response.status}: ${body}`);
  }
}

export async function runOverdueTaskReminders(companyId: string): Promise<ReminderRunResult> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO_NUMBER;

  if (!token || !phoneNumberId || !to) {
    return {
      ok: false,
      scanned: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      message: "Configuração WhatsApp incompleta no .env"
    };
  }

  const now = new Date();
  const tasks = await prisma.task.findMany({
    where: {
      companyId,
      status: "OPEN",
      dueAt: { not: null, lt: now },
      reminderSentAt: null
    },
    select: {
      id: true,
      title: true,
      note: true,
      dueAt: true,
      assignedTo: {
        select: {
          settings: {
            select: {
              whatsappReminders: true,
              timezone: true,
              dateFormat: true
            }
          }
        }
      }
    },
    orderBy: { dueAt: "asc" },
    take: 30
  });

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const task of tasks) {
    const whatsappRemindersEnabled = task.assignedTo?.settings?.whatsappReminders !== false;
    if (!task.dueAt || !whatsappRemindersEnabled) {
      skipped += 1;
      continue;
    }

    const messageLines = [
      "Lembrete CRM: tarefa vencida",
      `Tarefa: ${task.title}`,
      `Vencimento: ${formatDateTime(task.dueAt, {
        dateFormat: task.assignedTo?.settings?.dateFormat,
        timezone: task.assignedTo?.settings?.timezone
      })}`
    ];

    if (task.note) {
      messageLines.push(`Nota: ${task.note}`);
    }

    try {
      await sendWhatsAppMessage({
        token,
        phoneNumberId,
        to,
        text: messageLines.join("\n")
      });

      await prisma.task.updateMany({
        where: { id: task.id, companyId },
        data: { reminderSentAt: new Date() }
      });

      sent += 1;
    } catch {
      failed += 1;
    }
  }

  return {
    ok: failed === 0,
    scanned: tasks.length,
    sent,
    failed,
    skipped
  };
}
