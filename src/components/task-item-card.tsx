"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MoreHorizontal,
  CheckCircle2,
  CircleDashed,
  Trash2,
  Pencil,
  Calendar,
  Flag,
  FileText,
} from "lucide-react";
import {
  completeTaskAction,
  deleteTaskAction,
  reopenTaskAction,
  updateTaskAction,
} from "@/actions/task-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toDateTimeLocalInputValue } from "@/lib/date";
import { cn } from "@/lib/utils";

type TaskItemCardProps = {
  task: {
    id: string;
    title: string;
    note: string | null;
    dueAt: Date | null;
    status: string;
    priority: string;
  };
  overdue: boolean;
  dueLabel: string;
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: {
    label: "Baixa",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  MEDIUM: {
    label: "Média",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  HIGH: {
    label: "Alta",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
};

export function TaskItemCard({ task, overdue, dueLabel }: TaskItemCardProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (editing) {
          setEditing(false);
        } else {
          setOpen(false);
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, editing]);

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
  };

  const pConfig = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className={cn(
          "group overflow-hidden rounded-xl border p-3.5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md cursor-pointer flex flex-col justify-between",
          task.status === "DONE"
            ? "bg-emerald-600/50 border-emerald-600 dark:bg-emerald-600/20 dark:border-emerald-600/50"
            : "bg-white border-slate-100 dark:bg-slate-900/40 dark:border-slate-800",
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate font-semibold",
                task.status === "DONE"
                  ? "text-slate-400 line-through dark:text-slate-500"
                  : "text-slate-800 dark:text-slate-100",
              )}
              title={task.title}
            >
              {task.title}
            </p>
            {task.note ? (
              <p
                className="mt-1 line-clamp-2 break-words text-sm text-slate-500 dark:text-slate-400 leading-snug"
                title={task.note}
              >
                {task.note}
              </p>
            ) : null}
          </div>

          <div
            className="flex shrink-0 items-center justify-center -mr-1 -mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                  aria-label="Ações da tarefa"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-48 p-1.5 flex flex-col gap-1"
              >
                {task.status === "OPEN" ? (
                  <form action={completeTaskAction}>
                    <input type="hidden" name="id" value={task.id} />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Concluir
                    </button>
                  </form>
                ) : (
                  <form action={reopenTaskAction}>
                    <input type="hidden" name="id" value={task.id} />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <CircleDashed className="h-4 w-4 text-amber-500" />
                      Reabrir
                    </button>
                  </form>
                )}

                <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-800" />

                <form action={deleteTaskAction}>
                  <input type="hidden" name="id" value={task.id} />
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </form>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-bold",
              pConfig.className,
            )}
          >
            {pConfig.label}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-bold",
              overdue
                ? "bg-rose-100 border border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-200"
                : "bg-slate-100 border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
            )}
          >
            {dueLabel}
          </span>
        </div>
      </article>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Detalhes da tarefa"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
              />

              {/* Modal content */}
              <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div className="pr-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {editing ? "Editar Tarefa" : "Detalhes da Tarefa"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {editing
                        ? "Faça as alterações e salve"
                        : "Visualize as informações desta atividade"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {editing ? (
                  /* ── Edit Mode ── */
                  <form action={updateTaskAction} className="space-y-4">
                    <input type="hidden" name="id" value={task.id} />

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Título
                      </label>
                      <Input name="title" defaultValue={task.title} required />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Anotações
                      </label>
                      <Textarea
                        name="note"
                        defaultValue={task.note || ""}
                        className="min-h-24 resize-y"
                        placeholder="Mais contexto sobre a tarefa..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Data limite
                        </label>
                        <Input
                          name="dueAt"
                          type="datetime-local"
                          defaultValue={toDateTimeLocalInputValue(task.dueAt)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Prioridade
                        </label>
                        <Select name="priority" defaultValue={task.priority}>
                          <option value="LOW">Baixa</option>
                          <option value="MEDIUM">Média</option>
                          <option value="HIGH">Alta</option>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <Button type="submit" className="flex-1">
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setEditing(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* ── View Mode ── */
                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        Título
                      </p>
                      <p
                        className={cn(
                          "text-base font-semibold break-words",
                          task.status === "DONE"
                            ? "text-slate-400 line-through"
                            : "text-slate-900 dark:text-slate-100",
                        )}
                      >
                        {task.title}
                      </p>
                    </div>

                    {/* Note */}
                    {task.note ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Anotações
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed">
                          {task.note}
                        </p>
                      </div>
                    ) : null}

                    {/* Priority + Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1.5">
                          <Flag className="h-3.5 w-3.5" />
                          Prioridade
                        </p>
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-1 text-xs font-bold",
                            pConfig.className,
                          )}
                        >
                          {pConfig.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Lembrete
                        </p>
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-1 text-xs font-bold",
                            overdue
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                          )}
                        >
                          {dueLabel}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={() => setEditing(true)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Button>

                        {task.status === "OPEN" ? (
                          <form action={completeTaskAction} className="flex-1">
                            <input type="hidden" name="id" value={task.id} />
                            <Button
                              type="submit"
                              variant="outline"
                              className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Concluir
                            </Button>
                          </form>
                        ) : (
                          <form action={reopenTaskAction} className="flex-1">
                            <input type="hidden" name="id" value={task.id} />
                            <Button
                              type="submit"
                              variant="outline"
                              className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
                            >
                              <CircleDashed className="mr-2 h-4 w-4" />
                              Reabrir
                            </Button>
                          </form>
                        )}
                      </div>

                      <form action={deleteTaskAction}>
                        <input type="hidden" name="id" value={task.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir tarefa
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
