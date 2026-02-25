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
            helpContent={
              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  A <strong>API de Leads</strong> permite que você conecte
                  ferramentas como Zapier, n8n, Make ou o back-end do seu
                  próprio site para enviar contatos diretamente para o CRM.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Passo a passo no Zapier / Make / n8n:
                  </h4>
                  <ol className="list-decimal list-outside space-y-2 ml-4">
                    <li>
                      Crie um módulo de <strong>HTTP Request</strong> na sua
                      ferramenta de automação.
                    </li>
                    <li>
                      Defina o método como <strong>POST</strong> e insira a URL
                      (Endpoint).
                    </li>
                    <li>
                      Na aba de <strong>Headers</strong> (Cabeçalhos), adicione
                      as chaves de autenticação:
                      <ul className="mt-2 space-y-2 list-none text-xs rounded-md bg-white border border-slate-200 p-3 dark:bg-slate-950 dark:border-slate-800">
                        <li>
                          <span className="font-mono text-slate-500 mr-2">
                            x-company-id:
                          </span>
                          <code className="text-brand-600 dark:text-brand-400 font-semibold">
                            {session?.user.companyId}
                          </code>
                        </li>
                        <li>
                          <span className="font-mono text-slate-500 mr-2">
                            x-api-key:
                          </span>
                          <span className="text-slate-500 italic">
                            Pegue a variável INTEGRATION_API_KEY no seu arquivo
                            .env
                          </span>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Na aba de <strong>Body</strong> (Corpo), preencha no
                      formato JSON com as tags dinâmicas da sua ferramenta. (Ex:{" "}
                      <code>"name": {"{{LeadName}}"}</code>).
                    </li>
                    <li>Salve e faça um disparo de teste.</li>
                  </ol>
                </div>

                <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50">
                  <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                    Dica de Ouro
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 gap-1 leading-relaxed">
                    Sempre envie a propriedade <code>dealTitle</code> no JSON.
                    Se ela for enviada, o CRM criará o contato e automaticamente
                    abrirá uma negociação (Deal) associada na primeira etapa do
                    funil!
                  </p>
                </div>
              </div>
            }
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
                    x-api-key: [Pegue no seu .env]
                  </code>
                  <code className="block rounded-lg bg-white p-3 text-xs text-brand-600 font-semibold border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-brand-400 select-all">
                    x-company-id: {session?.user.companyId}
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
  -H "x-api-key: SUA_CHAVE_AQUI" \\
  -H "x-company-id: ${session?.user.companyId}" \\
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
            helpContent={
              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  O disparador do WhatsApp não é contínuo, ou seja, precisa de
                  uma "ignição" de fora (Cron Job) para checar o banco de dados
                  e fazer os disparos pendentes periodicamente.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Como ativar o disparo automático:
                  </h4>
                  <ol className="list-decimal list-outside space-y-2 ml-4">
                    <li>
                      Abra um serviço de agendamento de tarefas, como{" "}
                      <strong>Cron-job.org</strong> (gratuito) ou o agendador de
                      tarefas da própria <strong>Vercel (Cron)</strong>.
                    </li>
                    <li>
                      Crie um job para disparar a cada{" "}
                      <strong>5 ou 15 minutos</strong>.
                    </li>
                    <li>
                      Defina a ação como uma requisição <strong>POST</strong> na
                      URL exibida na página (Endpoint).
                    </li>
                    <li>
                      Configure os <strong>Headers</strong> para enviar as
                      credenciais:
                      <ul className="mt-2 space-y-2 list-none text-xs rounded-md bg-white border border-slate-200 p-3 dark:bg-slate-950 dark:border-slate-800">
                        <li>
                          <span className="font-mono text-slate-500 mr-2">
                            x-company-id:
                          </span>
                          <code className="text-brand-600 dark:text-brand-400 font-semibold">
                            {session?.user.companyId}
                          </code>
                        </li>
                        <li>
                          <span className="font-mono text-slate-500 mr-2">
                            x-run-key:
                          </span>
                          <span className="text-slate-500 italic">
                            Pegue a variável REMINDER_RUN_KEY no seu arquivo
                            .env
                          </span>
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    O que acontece nos bastidores?
                  </h4>
                  <p className="leading-relaxed">
                    O backend varre a tabela de Tarefas (`Task`) por registros
                    cujo <code>status</code> seja <code>OPEN</code> e cuja{" "}
                    <code>dueAt</code> seja anterior à hora atual. Se ele
                    encontrar e a tarefa ainda não tiver a marcação de{" "}
                    <code>reminderSentAt</code>, o sistema enviará um alerta
                    para a API oficial do WhatsApp (ou Evolution API).
                  </p>
                </div>
              </div>
            }
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
                    x-run-key: [Pegue no seu .env]
                  </code>
                  <code className="block rounded-lg bg-white p-3 text-xs text-brand-600 font-semibold border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-brand-400 select-all">
                    x-company-id: {session?.user.companyId}
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
