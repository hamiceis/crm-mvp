import { prisma } from "@/lib/prisma";
import { getRequiredSessionData } from "@/lib/permissions";
import { buildAccessFilter } from "@/lib/access-filter";
import { toCents } from "@/lib/utils";
import { DealsFilterForm } from "@/components/deals-filter-form";
import { DealsHeader } from "@/components/deals-header";
import { KanbanBoard } from "@/components/kanban-board";

type DealsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const toastMessages: Record<
  string,
  { message: string; tone: "success" | "error" }
> = {
  created: { message: "Negócio criado com sucesso.", tone: "success" },
  invalid_create: { message: "Dados do negócio inválidos.", tone: "error" },
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const { companyId, userId, isAdmin } = await getRequiredSessionData();
  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const owner = typeof params?.owner === "string" ? params.owner : "all";
  const minValue = typeof params?.min === "string" ? Number(params.min) : NaN;
  const maxValue = typeof params?.max === "string" ? Number(params.max) : NaN;
  const minValueCents = Number.isFinite(minValue) ? toCents(minValue) : NaN;
  const maxValueCents = Number.isFinite(maxValue) ? toCents(maxValue) : NaN;

  const accessFilter = buildAccessFilter({ companyId, userId, isAdmin });

  const where = {
    ...accessFilter,
    ...(q ? { title: { contains: q } } : {}),
    ...(Number.isFinite(minValueCents)
      ? { value: { gte: minValueCents } }
      : {}),
    ...(Number.isFinite(maxValueCents)
      ? {
          value: {
            ...(Number.isFinite(minValueCents) ? { gte: minValueCents } : {}),
            lte: maxValueCents,
          },
        }
      : {}),
    ...(isAdmin && owner === "mine" ? { ownerUserId: userId } : {}),
  };

  const deals = await prisma.deal.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="flex flex-col space-y-4">
      <DealsHeader toastMessages={toastMessages} />

      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <DealsFilterForm
          q={q}
          minValue={Number.isFinite(minValue) ? String(minValue) : ""}
          maxValue={Number.isFinite(maxValue) ? String(maxValue) : ""}
          isAdmin={isAdmin}
          owner={owner}
        />

        <div className="flex-1">
          <KanbanBoard
            initialDeals={deals.map((d) => ({
              id: d.id,
              title: d.title,
              stage: d.stage,
              value: d.value,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
