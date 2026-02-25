import { AppNavigation } from "@/components/app-navigation";

export function Sidebar() {
  return (
    <aside className="sticky top-6 hidden h-fit w-64 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 lg:block">
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">CRM MVP</h2>
      <AppNavigation />
    </aside>
  );
}
