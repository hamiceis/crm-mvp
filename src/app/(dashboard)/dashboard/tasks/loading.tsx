export default function TasksLoading() {
  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-64 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 border-l-4 dark:border-slate-800 dark:bg-slate-900"
            style={{ borderLeftColor: ["#6366f1", "#f59e0b", "#f43f5e"][i] }}
          >
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-8 w-12 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </section>

      <div>
        <div className="mb-4 flex flex-wrap gap-2 px-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-slate-100 p-3 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="mt-2 flex gap-2">
                    <div className="h-6 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
                    <div className="h-6 w-36 rounded-full bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-7 w-14 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
