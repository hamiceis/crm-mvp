"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { createDealAction } from "@/actions/crm-actions";
import {
  dealStages,
  dealStageLabels,
  defaultDealStage,
} from "@/lib/deal-stages";

export function CreateDealModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 shadow-lg shadow-brand-500/20"
      >
        <Plus className="h-4 w-4" />
        Novo negócio
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Novo Negócio"
        subtitle="Preencha os dados básicos para o funil"
      >
        <form
          action={async (formData) => {
            await createDealAction(formData);
            setIsOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Título do Negócio
            </label>
            <Input
              name="title"
              placeholder="Ex: Projeto de Consultoria"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Valor Estimado
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                R$
              </span>
              <CurrencyInput
                name="value"
                placeholder="0,00"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Etapa Inicial
            </label>
            <Select name="stage" defaultValue={defaultDealStage}>
              {dealStages.map((stage) => (
                <option key={stage} value={stage}>
                  {dealStageLabels[stage]}
                </option>
              ))}
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
              Criar Negócio
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
