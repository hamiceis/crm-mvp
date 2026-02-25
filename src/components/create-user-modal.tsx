"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { createUserAction } from "@/actions/user-actions";

export function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Novo usuário
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Novo Usuário"
        subtitle="Adicione um novo membro à equipe"
      >
        <form
          action={async (formData) => {
            await createUserAction(formData);
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
              placeholder="Ex: João Silva"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              E-mail
            </label>
            <Input
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Senha Temporária
            </label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Perfil de Acesso
            </label>
            <Select name="role" defaultValue="SALES">
              <option value="SALES">Vendas</option>
              <option value="ADMIN">Administrador</option>
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
              Criar Usuário
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
