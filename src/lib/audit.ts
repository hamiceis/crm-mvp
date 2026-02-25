import { prisma } from "@/lib/prisma";

type AuditInput = {
  companyId: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
};

/**
 * Non-blocking audit log — fires the DB write without awaiting.
 * Errors are logged but don't crash the calling action.
 */
export function createAuditLog(input: AuditInput) {
  prisma.auditLog
    .create({
      data: {
        companyId: input.companyId,
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    })
    .catch((error) => {
      console.error("[audit] Failed to create audit log:", error);
    });
}
