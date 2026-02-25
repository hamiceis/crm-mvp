"use client";

import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { createTaskAction } from "@/actions/task-actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UserDateFormat } from "@/lib/date";
import { combineDateAndTime, getDefaultDateInputValue, getDefaultTimeInputValue } from "@/lib/date";

export function TaskCreateForm({ dateFormat = "pt-BR" }: { dateFormat?: UserDateFormat }) {
  const [date, setDate] = useState(getDefaultDateInputValue());
  const [time, setTime] = useState(getDefaultTimeInputValue());

  const dueAt = useMemo(() => combineDateAndTime(date, time), [date, time]);
  const selectedDate = date ? new Date(`${date}T00:00:00`) : undefined;

  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat(dateFormat, { day: "2-digit", month: "2-digit", year: "numeric" }).format(selectedDate)
    : "Selecione uma data";

  return (
    <form action={createTaskAction} className="space-y-2">
      <Input name="title" placeholder="Ex: Ligar para lead da campanha" required />
      <Textarea className="min-h-24" name="note" placeholder="Anotações e contexto" />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="h-10 w-full justify-start font-normal">
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate whitespace-nowrap">{dateLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(selected) => {
                if (!selected) return;
                const year = selected.getFullYear();
                const month = String(selected.getMonth() + 1).padStart(2, "0");
                const day = String(selected.getDate()).padStart(2, "0");
                setDate(`${year}-${month}-${day}`);
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          className="h-10"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label="Hora do lembrete"
        />
      </div>

      <Input type="hidden" name="dueAt" value={dueAt} />

      <Select name="priority" defaultValue="MEDIUM">
        <option value="LOW">Baixa</option>
        <option value="MEDIUM">Média</option>
        <option value="HIGH">Alta</option>
      </Select>

      <Button className="w-full" type="submit">
        Salvar tarefa
      </Button>
    </form>
  );
}
