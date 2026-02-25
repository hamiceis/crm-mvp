import { auth } from "@/lib/auth";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const session = await auth();

  return (
    <main className="space-y-4">
      <Card>
        <CardContent>
          <CardTitle>Integrações</CardTitle>
          <p className="mt-2 text-sm text-slate-600">
            Use o endpoint abaixo para integrar formulários de site, automações
            (Zapier/Make/n8n) ou qualquer sistema externo e criar leads
            automaticamente no CRM.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <CardContent>
            <CardTitle className="text-base">Webhook/API de Leads</CardTitle>
            <p className="text-sm text-slate-600">Endpoint:</p>
            <code className="block rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100 break-all">
              POST /api/integrations/lead
            </code>

            <p className="mt-3 text-sm text-slate-600">Header obrigatório:</p>
            <code className="block rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100 break-all">
              x-api-key: INTEGRATION_API_KEY
            </code>
            <code className="mt-2 block rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100 break-all">
              x-company-id: COMPANY_ID
            </code>

            <p className="mt-3 text-sm text-slate-600">Body JSON:</p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
              {`{
  "name": "Maria Silva",
  "email": "maria@empresa.com",
  "phone": "+55 11 99999-0000",
  "company": "Empresa X",
  "source": "Landing Page",
  "dealTitle": "Plano Profissional",
  "dealValue": 3500,
  "stage": "LEAD"
}`}
            </pre>
          </CardContent>
        </Card>

        <Card className="space-y-3">
          <CardContent>
            <CardTitle className="text-base">Exemplo com cURL</CardTitle>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
              {`curl -X POST http://localhost:3000/api/integrations/lead \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: SUA_CHAVE" \\
  -H "x-company-id: SUA_COMPANY_ID" \\
  -d '{
    "name":"Lead teste",
    "email":"lead@teste.com",
    "source":"Zapier",
    "dealTitle":"Plano Enterprise",
    "dealValue":12000
  }'`}
            </pre>

            <p className="text-sm text-slate-600">
              O lead é criado como contato e, se enviar <code>dealTitle</code>,
              também cria um negócio automaticamente.
            </p>
            <p className="text-xs text-slate-500">
              Rate limit: 60 req/min por IP + company.
            </p>
            <p className="text-xs text-slate-500">
              Conta logada: {session?.user.email}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <CardContent>
            <CardTitle className="text-base">
              Lembretes de tarefas via WhatsApp
            </CardTitle>
            <p className="text-sm text-slate-600">Endpoint:</p>
            <code className="block rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100 break-all">
              POST /api/integrations/tasks/reminders
            </code>

            <p className="mt-3 text-sm text-slate-600">Header obrigatório:</p>
            <code className="block rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100 break-all">
              x-run-key: REMINDER_RUN_KEY
            </code>
            <code className="mt-2 block rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100 break-all">
              x-company-id: COMPANY_ID
            </code>

            <p className="mt-3 text-sm text-slate-600">
              Esse endpoint busca tarefas vencidas e abertas, envia alerta por
              WhatsApp e marca com <code>reminderSentAt</code> para evitar
              duplicidade.
            </p>
          </CardContent>
        </Card>

        <Card className="space-y-3">
          <CardContent>
            <CardTitle className="text-base">
              Exemplo de execução (cron)
            </CardTitle>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
              {`curl -X POST http://localhost:3000/api/integrations/tasks/reminders \\
  -H "x-run-key: SUA_REMINDER_RUN_KEY" \\
  -H "x-company-id: SUA_COMPANY_ID"`}
            </pre>
            <p className="text-sm text-slate-600">
              Recomenda-se rodar a cada 5 minutos no cron do seu servidor ou no
              agendador do provedor.
            </p>
            <p className="text-xs text-slate-500">
              Rate limit: 12 req/min por IP + company.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
