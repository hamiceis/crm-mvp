import { auth } from "@/lib/auth";
import { IntegrationCard } from "@/components/integration-card";
import {
  IconWhatsApp,
  IconWebhook,
  IconGoogleCalendar,
  IconEmail,
  IconZapier,
  IconSlack,
  IconGoogleSheets,
} from "@/components/integration-icons";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const session = await auth();

  return (
    <main className="space-y-8 pb-8">
      <header className="px-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Hub de Integrações
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Conecte seus aplicativos favoritos ao CRM para centralizar informações
          e automatizar fluxos de trabalho.
        </p>
      </header>

      {/* Categoria: Automação */}
      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Automação
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            name="API de Leads / Webhook"
            description="Crie leads automaticamente no CRM a partir de landing pages, formulários ou qualquer sistema externo."
            icon={<IconWebhook className="h-6 w-6" />}
            status="active"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Endpoint:
                </p>
                <code className="mt-1 block rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 break-all select-all">
                  POST /api/integrations/lead
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Headers Obrigatórios:
                </p>
                <div className="mt-1 space-y-2">
                  <code className="block rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 select-all">
                    x-api-key: INTEGRATION_API_KEY
                  </code>
                  <code className="block rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 select-all">
                    x-company-id: COMPANY_ID
                  </code>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Exemplo cURL:
                </p>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-4 text-xs text-slate-300 dark:bg-slate-950">
                  {`curl -X POST http://localhost:3000/api/integrations/lead \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: SUA_CHAVE" \\
  -H "x-company-id: SUA_COMPANY_ID" \\
  -d '{
    "name":"Lead teste",
    "email":"lead@teste.com",
    "source":"Website",
    "dealTitle":"Plano Profissional",
    "dealValue":3500
  }'`}
                </pre>
              </div>
              <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside mt-2">
                <li>Rate limit: 60 req/min por IP + company.</li>
                <li>Sua conta atual: {session?.user.email}</li>
              </ul>
            </div>
          </IntegrationCard>

          <IntegrationCard
            name="Zapier / Make / n8n"
            description="Conecte seu CRM a mais de 5.000 aplicativos usando ferramentas de automação visual no-code."
            icon={<IconZapier className="h-6 w-6" />}
            status="coming_soon"
          />
        </div>
      </section>

      {/* Categoria: Comunicação */}
      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Comunicação
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            name="WhatsApp Lembretes"
            description="Dispare lembretes proativos de tarefas pendentes e follow-ups atrasados diretamente para o WhatsApp do responsável."
            icon={<IconWhatsApp className="h-6 w-6" />}
            status="active"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Endpoint (Job / Cron):
                </p>
                <code className="mt-1 block rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 break-all select-all">
                  POST /api/integrations/tasks/reminders
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Como funciona:
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Configure este endpoint no agendador de tarefas do seu
                  servidor (cron) ou na Vercel para rodar a cada 5 a 15 minutos.
                  Ele buscará as tarefas atrasadas ainda não notificadas e
                  enviará a mensagem.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Headers Obrigatórios:
                </p>
                <div className="mt-1 space-y-2">
                  <code className="block rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 select-all">
                    x-run-key: REMINDER_RUN_KEY
                  </code>
                  <code className="block rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 select-all">
                    x-company-id: COMPANY_ID
                  </code>
                </div>
              </div>
            </div>
          </IntegrationCard>

          <IntegrationCard
            name="E-mail / SMTP"
            description="Sincronize sua caixa de entrada, registre trocas de e-mail automaticamente no histórico do contato e crie campanhas."
            icon={<IconEmail className="h-6 w-6" />}
            status="coming_soon"
          />
        </div>
      </section>

      {/* Categoria: Produtividade */}
      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Produtividade
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            name="Google Calendar"
            description="Sincronize suas tarefas e reuniões agendadas no CRM diretamente com sua agenda."
            icon={<IconGoogleCalendar className="h-6 w-6" />}
            status="coming_soon"
          />

          <IntegrationCard
            name="Google Sheets"
            description="Exporte automaticamente os leads, relatórios de pipeline e contatos para planilhas da equipe."
            icon={<IconGoogleSheets className="h-6 w-6" />}
            status="coming_soon"
          />
        </div>
      </section>

      {/* Categoria: Notificações */}
      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Notificações Internas
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            name="Slack"
            description="Receba alertas instantâneos no canal de vendas quando um lead qualificado for gerado ou um negócio for fechado."
            icon={<IconSlack className="h-6 w-6" />}
            status="coming_soon"
          />
        </div>
      </section>
    </main>
  );
}
