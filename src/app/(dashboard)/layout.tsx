import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemePreferenceSync } from "@/components/theme-preference-sync";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
    select: { themePreference: true },
  });

  const validPreferences = ["light", "dark", "system"] as const;
  type ThemePref = (typeof validPreferences)[number];
  const rawPref = settings?.themePreference ?? "system";
  const themePreference: ThemePref = validPreferences.includes(
    rawPref as ThemePref,
  )
    ? (rawPref as ThemePref)
    : "system";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
      <ThemePreferenceSync preference={themePreference} />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <MobileSidebar />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Logado como
              </p>
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {session.user.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Perfil: {role === "ADMIN" ? "Administrador" : "Vendas"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
}
