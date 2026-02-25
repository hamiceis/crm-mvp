"use client";

import { useMemo, useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Modal } from "@/components/ui/modal";
import { createTaskAction } from "@/actions/task-actions";
import type { UserDateFormat } from "@/lib/date";
import {
  combineDateAndTime,
  getDefaultDateInputValue,
  getDefaultTimeInputValue,
} from "@/lib/date";

export function CreateTaskModal({
  dateFormat = "pt-BR",
}: {
  dateFormat?: UserDateFormat;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(getDefaultDateInputValue());
  const [time, setTime] = useState(getDefaultTimeInputValue());

  const dueAt = useMemo(() => combineDateAndTime(date, time), [date, time]);
  const selectedDate = date ? new Date(`${date}T00:00:00`) : undefined;

  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat(dateFormat, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(selectedDate)
    : "Selecione uma data";

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Nova tarefa
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Nova Tarefa"
        subtitle="Agende lembretes e atividades"
        maxWidth="max-w-lg"
      >
        <form
          action={async (formData) => {
            await createTaskAction(formData);
            setIsOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Título
            </label>
            <Input
              name="title"
              placeholder="O que precisa ser feito?"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Anotações (opcional)
            </label>
            <Textarea
              name="note"
              placeholder="Mais detalhes sobre a tarefa..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Data
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{dateLabel}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(selected) => {
                      if (!selected) return;
                      const year = selected.getFullYear();
                      const month = String(selected.getMonth() + 1).padStart(
                        2,
                        "0",
                      );
                      const day = String(selected.getDate()).padStart(2, "0");
                      setDate(`${year}-${month}-${day}`);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Hora
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <Input type="hidden" name="dueAt" value={dueAt} />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prioridade
            </label>
            <Select name="priority" defaultValue="MEDIUM">
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button className="flex-1" type="submit">
              Criar Tarefa
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
