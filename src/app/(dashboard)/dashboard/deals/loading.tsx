export default function DealsLoading() {
  return (
    <main className="flex h-[calc(100vh-100px)] flex-col space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-36 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex gap-2">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-[350px] flex-1 animate-pulse rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="mb-3 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2.5 shadow-sm dark:bg-slate-950/70">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="space-y-3 p-1">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div
                    key={j}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
