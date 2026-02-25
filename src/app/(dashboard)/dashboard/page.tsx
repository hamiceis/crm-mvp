import { prisma } from "@/lib/prisma";
import { getRequiredSessionData } from "@/lib/permissions";
import { buildAccessFilter, buildTaskAccessFilter } from "@/lib/access-filter";
import { currencyFromCents } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { companyId, userId, isAdmin } = await getRequiredSessionData();

  const accessFilter = buildAccessFilter({ companyId, userId, isAdmin });
  const taskFilter = buildTaskAccessFilter({ companyId, userId, isAdmin });

  const [contacts, deals, dealValue, recentDeals, openTasks] =
    await Promise.all([
      prisma.contact.count({ where: accessFilter }),
      prisma.deal.count({ where: accessFilter }),
      prisma.deal.aggregate({
        where: {
          ...accessFilter,
          stage: { in: ["PROPOSAL", "NEGOTIATION", "WON"] },
        },
        _sum: { value: true },
      }),
      prisma.deal.findMany({
        where: accessFilter,
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.task.count({
        where: { ...taskFilter, status: "OPEN" },
      }),
    ]);

  return (
    <main className="space-y-4">
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-xs text-slate-500">Contatos</p>
            <p className="mt-2 text-2xl font-bold">{contacts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-slate-500">Negócios</p>
            <p className="mt-2 text-2xl font-bold">{deals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-slate-500">Pipeline ativo</p>
            <p className="mt-2 text-2xl font-bold">
              {currencyFromCents(dealValue._sum.value || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-slate-500">Tarefas abertas</p>
            <p className="mt-2 text-2xl font-bold">{openTasks}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent>
          <CardTitle className="mb-3">Negócios recentes</CardTitle>
          <div className="space-y-2">
            {recentDeals.map(
              (deal: {
                id: string;
                title: string;
                stage: string;
                value: number;
              }) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold">{deal.title}</p>
                    <p className="text-xs text-slate-500">{deal.stage}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {currencyFromCents(deal.value)}
                  </p>
                </div>
              ),
            )}
            {recentDeals.length === 0 ? (
              <p className="text-sm text-slate-500">Sem negócios ainda.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
