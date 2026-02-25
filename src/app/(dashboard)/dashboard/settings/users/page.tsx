import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ToastFromQuery } from "@/components/toast-from-query";
import { CreateUserModal } from "@/components/create-user-modal";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const roleLabel = {
  ADMIN: "Administrador",
  SALES: "Vendas"
} as const;

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function getRoleLabel(role: string) {
  return roleLabel[role as keyof typeof roleLabel] ?? role;
}

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = (await prisma.user.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: "desc" }
  })) as UserRow[];

  const toastMessages: Record<string, { message: string; tone: "success" | "error" }> = {
    user_created: { message: "Usuário criado com sucesso.", tone: "success" },
    invalid_user: { message: "Dados do usuário inválidos.", tone: "error" },
    email_taken: { message: "Email já está em uso.", tone: "error" }
  };

  return (
    <main className="space-y-6">
      <ToastFromQuery messages={toastMessages} />

      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/settings" className="text-sm text-brand-600 hover:underline dark:text-brand-400">
              Configurações
            </Link>
            <span className="text-slate-400">/</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gerenciar Usuários</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Adicione e gerencie os membros da sua equipe</p>
        </div>
        
        <div className="flex items-center gap-2">
           <CreateUserModal />
        </div>
      </header>

      <Card>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Membros da Equipe</CardTitle>
            <span className="text-sm font-medium text-slate-500">{users.length} usuário(s)</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user: UserRow) => (
              <article key={user.id} className="group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-900/30 dark:group-hover:text-brand-400">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      user.role === "ADMIN" 
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </article>
            ))}
          </div>

          {users.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">Nenhum usuário cadastrado além de você.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
