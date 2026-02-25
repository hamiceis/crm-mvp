import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordAction, updatePreferencesAction, updateProfileAction } from "@/actions/settings-actions";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToastFromQuery } from "@/components/toast-from-query";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/lib/date";
import { SettingsTabs } from "@/components/settings-tabs";
import { getDealStageLabel } from "@/lib/deal-stages";
import { PreferencesForm } from "@/components/preferences-form";

export const dynamic = "force-dynamic";

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type UserProfileRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
};

type SettingsRow = {
  timezone: string;
  dateFormat: string;
  themePreference: string;
  whatsappReminders: boolean;
};

type AuditLogRow = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: string | null;
  createdAt: Date | string;
  user?: {
    name: string | null;
    email: string | null;
  } | null;
};

const toastMessages: Record<string, { message: string; tone: "success" | "error" }> = {
  profile_updated: { message: "Perfil atualizado com sucesso.", tone: "success" },
  password_updated: { message: "Senha atualizada com sucesso.", tone: "success" },
  preferences_updated: { message: "Preferências salvas com sucesso.", tone: "success" },
  invalid_profile: { message: "Não foi possível atualizar o perfil.", tone: "error" },
  invalid_password: { message: "Não foi possível atualizar a senha.", tone: "error" },
  invalid_preferences: { message: "Não foi possível salvar as preferências.", tone: "error" },
  wrong_password: { message: "Senha atual incorreta.", tone: "error" },
  password_mismatch: { message: "A confirmação da senha não confere.", tone: "error" }
};

function getActionLabel(action: string) {
  if (action === "CREATE") return "Criou";
  if (action === "UPDATE") return "Atualizou";
  if (action === "DELETE") return "Excluiu";
  if (action === "UPDATE_STAGE") return "Moveu";
  if (action === "LOGIN") return "Acessou o sistema";
  return action;
}

function getEntityLabel(entity: string) {
  const labels: Record<string, string> = {
    DEAL: "Negócio",
    CONTACT: "Contato",
    TASK: "Tarefa",
    USER: "Usuário",
    COMPANY: "Empresa",
    SETTINGS: "Preferências",
    AUDIT: "Auditoria"
  };
  return labels[entity] || entity;
}

function formatAuditMetadata(raw: string | null) {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const chunks: string[] = [];
    if (typeof parsed.title === "string") chunks.push(`Título: ${parsed.title}`);
    if (typeof parsed.name === "string") chunks.push(`Nome: ${parsed.name}`);
    if (typeof parsed.newStage === "string") {
      chunks.push(`Para: ${getDealStageLabel(parsed.newStage)}`);
    }
    if (typeof parsed.role === "string") {
      chunks.push(`Perfil: ${parsed.role === "ADMIN" ? "Administrador" : "Vendas"}`);
    }
    return chunks.join(" | ");
  } catch {
    return "";
  }
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth();
  if (searchParams) await searchParams;
  if (!session?.user?.id || !session.user.companyId) {
    redirect("/login");
  }

  const [user, settings] = (await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })
  ])) as [UserProfileRow | null, SettingsRow | null];

  let auditLogs: AuditLogRow[] = [];
  try {
    auditLogs = (await prisma.auditLog.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })) as AuditLogRow[];
  } catch {
    auditLogs = [];
  }

  return (
    <main className="space-y-6">
      <ToastFromQuery messages={toastMessages} />

      <header className="px-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configurações</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie sua conta e preferências do sistema</p>
      </header>

      <SettingsTabs isAdmin={session.user.role === "ADMIN"}>
        {{
          profile: (
            <Card className="max-w-2xl border-none bg-transparent shadow-none">
              <CardContent className="p-0">
                <CardTitle className="mb-4 text-lg">Dados Pessoais</CardTitle>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <form action={updateProfileAction} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Nome Completo</Label>
                      <Input name="name" defaultValue={user?.name || ""} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>E-mail</Label>
                      <Input value={user?.email || ""} disabled className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Nível de Acesso</Label>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                        {user?.role === "ADMIN" ? "Administrador da Conta" : "Membro da Equipe (Vendas)"}
                      </div>
                    </div>
                    <Button type="submit">Atualizar Perfil</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ),
          security: (
            <Card className="max-w-2xl border-none bg-transparent shadow-none">
              <CardContent className="p-0">
                <CardTitle className="mb-4 text-lg">Segurança e Senha</CardTitle>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <form action={changePasswordAction} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Senha Atual</Label>
                      <Input name="currentPassword" type="password" required placeholder="••••••••" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Nova Senha</Label>
                        <Input name="newPassword" type="password" required placeholder="Mínimo 6 caracteres" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Confirmar Nova Senha</Label>
                        <Input name="confirmPassword" type="password" required placeholder="Repita a nova senha" />
                      </div>
                    </div>
                    <Button type="submit">Alterar Senha</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ),
          preferences: (
            <PreferencesForm settings={settings ?? undefined} action={updatePreferencesAction} />
          ),
          audit: (
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="p-0">
                <div className="mb-4 flex items-center justify-between">
                  <CardTitle className="text-lg">Histórico de Ações</CardTitle>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Últimos 24 eventos</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {auditLogs.map((log: AuditLogRow) => (
                    <article key={log.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                          {getActionLabel(log.action)} {getEntityLabel(log.entity)}
                        </p>
                        <span className="text-[9px] font-medium text-slate-400">
                          {formatDateTime(log.createdAt, {
                            dateFormat: settings?.dateFormat,
                            timezone: settings?.timezone,
                            emptyLabel: "-"
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Por: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.user?.name || log.user?.email || "Sistema"}</span>
                      </p>
                      {formatAuditMetadata(log.metadata) && (
                        <div className="mt-2 rounded bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                          {formatAuditMetadata(log.metadata)}
                        </div>
                      )}
                    </article>
                  ))}
                  {auditLogs.length === 0 && <p className="col-span-full py-8 text-center text-xs text-slate-400">Nenhum evento registrado.</p>}
                </div>
              </CardContent>
            </Card>
          )
        }}
      </SettingsTabs>
    </main>
  );
}
