import { loginAction } from "@/actions/auth-actions";
import { ThemeToggle, ThemeToggleWithLabel } from "@/components/theme-toggle";
import { ToastFromQuery } from "@/components/toast-from-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const toastMessages: Record<
    string,
    { message: string; tone: "success" | "error" }
  > = {
    invalid_login: { message: "Credenciais inválidas.", tone: "error" },
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center p-4 sm:p-6">
      <ToastFromQuery messages={toastMessages} />
      <div className="relative grid w-full items-stretch gap-8 rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="absolute right-4 top-4">
          <div className="sm:hidden">
            <ThemeToggleWithLabel />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>

        <section className="flex flex-col justify-center mt-12 sm:mt-0">
          <span className="mb-3 inline-block w-fit rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            CRM moderno
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Feche mais negócios com contexto
          </h1>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Organize leads, pipeline e tarefas em um só lugar. Seu time ganha
            ritmo comercial, evita follow-up perdido e executa melhor todos os
            dias.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="font-semibold">Pipeline visual</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Acompanhe status dos negócios em tempo real.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="font-semibold">Tarefas e lembretes</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Nunca perca um follow-up importante.
              </p>
            </div>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200">
              <p>Admin seed: admin@crm.local / Admin@123</p>
              <p>Vendas seed: vendas@crm.local / Vendas@123</p>
            </div>
          )}
        </section>

        <Card className="self-center">
          <CardContent>
            <CardTitle className="mb-1 text-xl">Entrar</CardTitle>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">
              Acesse sua área de trabalho comercial.
            </p>

            <form action={loginAction} className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <Label>Senha</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Acessar CRM
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
