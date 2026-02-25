import { prisma } from "@/lib/prisma";
import { getRequiredSessionData } from "@/lib/permissions";
import { buildTaskAccessFilter } from "@/lib/access-filter";
import { TaskStatus } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { TaskItemCard } from "@/components/task-item-card";
import { cn } from "@/lib/utils";
import { CreateTaskModal } from "@/components/create-task-modal";
import { formatDateTime, isOverdueDate, type UserDateFormat } from "@/lib/date";
import { ToastFromQuery } from "@/components/toast-from-query";
import { Pagination } from "@/components/pagination";
import Link from "next/link";

type TasksPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type TaskRow = {
  id: string;
  title: string;
  note: string | null;
  dueAt: Date | null;
  status: string;
  priority: string;
};

const toastMessages: Record<
  string,
  { message: string; tone: "success" | "error" }
> = {
  created: { message: "Tarefa criada com sucesso.", tone: "success" },
  updated: { message: "Tarefa atualizada com sucesso.", tone: "success" },
  deleted: { message: "Tarefa excluída com sucesso.", tone: "success" },
  completed: { message: "Tarefa marcada como concluída.", tone: "success" },
  reopened: { message: "Tarefa reaberta com sucesso.", tone: "success" },
  forbidden_task: {
    message: "Você não possui permissão para alterar essa tarefa.",
    tone: "error",
  },
  invalid_create: {
    message: "Não foi possível criar a tarefa. Verifique os campos.",
    tone: "error",
  },
  invalid_update: {
    message: "Não foi possível concluir a ação para a tarefa.",
    tone: "error",
  },
};

const filterOptions = [
  { value: "all", label: "Todas" },
  { value: "open", label: "Abertas" },
  { value: "done", label: "Concluídas" },
  { value: "today", label: "Vencem hoje" },
  { value: "overdue", label: "Atrasadas" },
] as const;

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { companyId, userId, isAdmin } = await getRequiredSessionData();
  const params = searchParams ? await searchParams : undefined;

  const filter = typeof params?.filter === "string" ? params.filter : "all";
  const page = Math.max(
    1,
    Number(typeof params?.page === "string" ? params.page : "1") || 1,
  );
  const pageSize = 12;

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const baseWhere = buildTaskAccessFilter({ companyId, userId, isAdmin });

  const where = {
    ...baseWhere,
    ...(filter === "open" ? { status: TaskStatus.OPEN } : {}),
    ...(filter === "done" ? { status: TaskStatus.DONE } : {}),
    ...(filter === "today"
      ? {
          status: TaskStatus.OPEN,
          dueAt: { gte: startOfDay, lte: endOfDay },
        }
      : {}),
    ...(filter === "overdue"
      ? {
          status: TaskStatus.OPEN,
          dueAt: { lt: now },
        }
      : {}),
  };

  const [tasks, totalCount, openCount, dueTodayCount, overdueCount, settings] =
    (await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...baseWhere, status: "OPEN" } }),
      prisma.task.count({
        where: {
          ...baseWhere,
          status: "OPEN",
          dueAt: { gte: startOfDay, lte: endOfDay },
        },
      }),
      prisma.task.count({
        where: {
          ...baseWhere,
          status: "OPEN",
          dueAt: { lt: now },
        },
      }),
      prisma.userSettings.findUnique({
        where: { userId },
        select: { dateFormat: true, timezone: true },
      }),
    ])) as [
      TaskRow[],
      number,
      number,
      number,
      number,
      { dateFormat: UserDateFormat; timezone: string } | null,
    ];

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  return (
    <main className="space-y-6">
      <ToastFromQuery messages={toastMessages} />

      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Tarefas e Lembretes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie sua agenda e atividades diárias
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreateTaskModal dateFormat={settings?.dateFormat ?? "pt-BR"} />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-brand-500">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tarefas abertas
            </p>
            <p className="mt-1 text-3xl font-bold">{openCount}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Vencem hoje
            </p>
            <p className="mt-1 text-3xl font-bold">{dueTodayCount}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Atrasadas
            </p>
            <p className="mt-1 text-3xl font-bold text-rose-600 dark:text-rose-500">
              {overdueCount}
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-1">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = option.value === filter;
                return (
                  <Link
                    key={option.value}
                    href={`/dashboard/tasks?filter=${option.value}&page=1`}
                    className={cn(
                      "rounded-xl border px-4 py-1.5 text-xs font-semibold transition-all",
                      active
                        ? "border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                    )}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {totalCount} registro(s)
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task: TaskRow) => {
              const dueAt = task.dueAt ? new Date(task.dueAt) : null;
              const overdue =
                task.status === "OPEN" && isOverdueDate(dueAt, now);

              return (
                <TaskItemCard
                  key={task.id}
                  task={task}
                  overdue={Boolean(overdue)}
                  dueLabel={formatDateTime(dueAt, {
                    dateFormat: settings?.dateFormat,
                    timezone: settings?.timezone,
                  })}
                />
              );
            })}
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 dark:border-slate-700 dark:bg-slate-900/30">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Nenhuma tarefa encontrada para este filtro.
              </p>
            </div>
          ) : null}

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </CardContent>
      </Card>
    </main>
  );
}
