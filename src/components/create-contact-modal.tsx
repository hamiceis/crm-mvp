"use client";

import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Modal } from "@/components/ui/modal";
import { createContactAction } from "@/actions/crm-actions";

export function CreateContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Novo contato
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Novo Contato"
        subtitle="Adicione um novo lead ou cliente"
      >
        <form
          action={async (formData) => {
            await createContactAction(formData);
            setIsOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nome Completo
            </label>
            <Input
              name="name"
              placeholder="Ex: Maria Oliveira"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                E-mail
              </label>
              <Input
                name="email"
                type="email"
                placeholder="maria@exemplo.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Telefone
              </label>
              <PhoneInput name="phone" placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Empresa
            </label>
            <Input name="company" placeholder="Nome da empresa" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Origem
            </label>
            <Input
              name="source"
              placeholder="Ex: LinkedIn, Indicação, Ads..."
            />
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
              Salvar Contato
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
