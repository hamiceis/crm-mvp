export default function ContactsLoading() {
  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-56 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-9 w-80 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
