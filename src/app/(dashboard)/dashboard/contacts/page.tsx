import { prisma } from "@/lib/prisma";
import { getRequiredSessionData } from "@/lib/permissions";
import { buildAccessFilter } from "@/lib/access-filter";
import { ToastFromQuery } from "@/components/toast-from-query";
import { CreateContactModal } from "@/components/create-contact-modal";
import { ContactsFilterForm } from "@/components/contacts-filter-form";
import { Pagination } from "@/components/pagination";
import { User, Building, Mail, Globe } from "lucide-react";

type ContactsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type ContactRow = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  source: string | null;
  phone?: string | null;
};

type SourceRow = {
  source: string | null;
};

const toastMessages: Record<
  string,
  { message: string; tone: "success" | "error" }
> = {
  created: { message: "Contato criado com sucesso.", tone: "success" },
  invalid_create: { message: "Dados do contato inválidos.", tone: "error" },
};

export default async function ContactsPage({
  searchParams,
}: ContactsPageProps) {
  const { companyId, userId, isAdmin } = await getRequiredSessionData();
  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const source = typeof params?.source === "string" ? params.source : "all";
  const owner = typeof params?.owner === "string" ? params.owner : "all";
  const page = Math.max(
    1,
    Number(typeof params?.page === "string" ? params.page : "1") || 1,
  );
  const pageSize = 12;

  const accessFilter = buildAccessFilter({ companyId, userId, isAdmin });

  const where = {
    ...accessFilter,
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
          ],
        }
      : {}),
    ...(source !== "all" ? { source } : {}),
    ...(isAdmin && owner === "mine" ? { ownerUserId: userId } : {}),
  };

  const [contacts, totalCount, sources] = (await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contact.count({ where }),
    prisma.contact.findMany({
      where: { companyId },
      select: { source: true },
      distinct: ["source"],
    }),
  ])) as [ContactRow[], number, SourceRow[]];

  const totalPages = Math.max(1, Math.ceil(Number(totalCount) / pageSize));
  const sourceOptions = sources
    .map((item: SourceRow) => item.source)
    .filter((item): item is string => Boolean(item))
    .sort();

  return (
    <main className="space-y-6">
      <ToastFromQuery messages={toastMessages} />

      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Contatos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie seus leads e relacionamentos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreateContactModal />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <ContactsFilterForm
          initialQ={q}
          sourceOptions={sourceOptions}
          isAdmin={isAdmin}
          initialOwner={owner}
          initialSource={source}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact: ContactRow) => (
            <article
              key={contact.id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-slate-800 dark:text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
                    {contact.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">
                      {contact.email || "Sem e-mail"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Building className="h-3 w-3 text-slate-400" />
                  <span className="font-medium truncate">
                    {contact.company || "Sem empresa"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Globe className="h-3 w-3 text-slate-400" />
                  <span className="truncate">
                    Origem:{" "}
                    <span className="font-medium">
                      {contact.source || "Não informada"}
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 dark:border-slate-700 dark:bg-slate-900/30">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Nenhum contato encontrado.
            </p>
          </div>
        ) : null}

        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
