export default function DashboardLoading() {
  return (
    <main className="space-y-4">
      <section className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-7 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </section>

      <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3 dark:border-slate-800"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
