"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const timezoneOptions = [
  "America/Sao_Paulo",
  "America/Fortaleza",
  "America/Manaus",
  "America/New_York",
  "UTC"
] as const;

type PreferencesFormSettings = {
  timezone?: string;
  dateFormat?: string;
  themePreference?: "light" | "dark" | "system" | (string & {});
  whatsappReminders?: boolean;
};

type PreferencesFormProps = {
  settings?: PreferencesFormSettings;
  action?: (formData: FormData) => Promise<void>;
};

export function PreferencesForm({ settings, action }: PreferencesFormProps) {
  return (
    <Card className="max-w-2xl border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <CardTitle className="mb-4 text-lg">Preferências de Exibição</CardTitle>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Fuso Horário</Label>
              <Select name="timezone" defaultValue={settings?.timezone ?? "America/Sao_Paulo"}>
                {timezoneOptions.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Formato de Data</Label>
              <Select name="dateFormat" defaultValue={settings?.dateFormat ?? "pt-BR"}>
                <option value="pt-BR">Brasil (dd/mm/aaaa)</option>
                <option value="en-US">EUA (mm/dd/yyyy)</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tema da Interface</Label>
              <Select name="themePreference" defaultValue={settings?.themePreference ?? "system"}>
                <option value="system">Seguir Sistema (Padrão)</option>
                <option value="light">Sempre Claro</option>
                <option value="dark">Sempre Escuro</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notificações WhatsApp</Label>
              <Select name="whatsappReminders" defaultValue={settings?.whatsappReminders === false ? "off" : "on"}>
                <option value="on">Habilitar Lembretes</option>
                <option value="off">Desabilitar Lembretes</option>
              </Select>
            </div>
            <Button type="submit">Salvar Preferências</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
