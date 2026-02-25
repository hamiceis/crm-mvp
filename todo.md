# CRM Simple — Plano de Melhorias

> Checklist de melhorias organizado por fases. Marque `[x]` conforme completar cada item.
> Gerado em: 2026-02-23

---

## Fase 1 — Segurança Crítica (Quick Wins)

- [x] Esconder credenciais de seed na tela de login (condicionar a `NODE_ENV === "development"`)
- [x] Usar `crypto.timingSafeEqual` na comparação de API key em `api/integrations/lead/route.ts`
- [x] Usar `crypto.timingSafeEqual` na comparação de run key em `api/integrations/tasks/reminders/route.ts`
- [x] Remover type assertions inseguras (`as`) nos callbacks JWT/session em `lib/auth.ts`
- [x] Criar `.env.example` com todas as variáveis documentadas

---

## Fase 2 — Migração SQLite → PostgreSQL

- [x] Alterar `provider` no `schema.prisma` de `"sqlite"` para `"postgresql"`
- [x] Remover `engineType = "binary"` do generator
- [x] Simplificar `lib/prisma.ts` (remover adapter `PrismaBetterSqlite3`, usar PrismaClient direto)
- [x] Atualizar `prisma/seed.js` removendo refs ao adapter SQLite
- [x] Remover deps do `package.json`: `@prisma/adapter-better-sqlite3`, `better-sqlite3`
- [x] Deletar migrations antigas em `prisma/migrations/`
- [ ] Criar nova initial migration: `npx prisma migrate dev --name init`
- [ ] Testar: seed, login, dashboard, CRUD completo
- [x] Atualizar `.env.example` com formato PostgreSQL na `DATABASE_URL`

---

## Fase 3 — Integridade do Schema (requer Fase 2)

- [x] Criar enum `Role` no schema (`ADMIN`, `SALES`)
- [x] Criar enum `DealStage` no schema (`LEAD`, `QUALIFIED`, `PROPOSAL`, `NEGOTIATION`, `WON`, `LOST`)
- [x] Criar enum `TaskStatus` no schema (`OPEN`, `DONE`)
- [x] Criar enum `TaskPriority` no schema (`LOW`, `MEDIUM`, `HIGH`)
- [x] Trocar `String` por enum em `User.role`, `Deal.stage`, `Task.status`, `Task.priority`
- [x] Adicionar campo `companyId` ao model `Activity` com FK e índice
- [x] Atualizar `lib/deal-stages.ts` para usar enum gerado pelo Prisma
- [x] Atualizar `lib/permissions.ts` para usar enum `Role` do Prisma
- [x] Atualizar type assertions em server actions e pages para usar enums
- [ ] Gerar migration: `npx prisma migrate dev --name add-enums-and-activity-company`
- [ ] Testar: build, seed, fluxos CRUD

---

## Fase 4 — Arquitetura & Qualidade de Código

- [x] Criar helper `buildAccessFilter(session)` em `lib/access-filter.ts`
- [x] Criar variação `buildTaskAccessFilter(session)` (usa `assignedToId`)
- [ ] Substituir filtros duplicados em `dashboard/page.tsx`
- [ ] Substituir filtros duplicados em `contacts/page.tsx`
- [ ] Substituir filtros duplicados em `deals/page.tsx`
- [ ] Substituir filtros duplicados em `tasks/page.tsx`
- [x] Criar componente `<Pagination>` reutilizável em `components/pagination.tsx`
- [ ] Substituir markup de paginação em `contacts/page.tsx`
- [ ] Substituir markup de paginação em `tasks/page.tsx`
- [x] Remover `export const dynamic = "force-dynamic"` do root `layout.tsx`
- [ ] Melhorar error handling nas server actions (retornar `{ error }` ao invés de redirect para erros de validação)

---

## Fase 5 — DX & Manutenibilidade

- [x] Converter `prisma/seed.js` → `prisma/seed.ts`
- [x] Adicionar `tsx` como devDependency
- [x] Atualizar script de seed no `package.json` e `prisma.config.ts`
- [x] Deletar `prisma/seed.js`
- [ ] Verificar e configurar ESLint (`npx next lint`)
- [ ] Resolver warnings de lint

---

## Fase 6 — Testes

- [ ] Instalar Vitest + Testing Library + plugin React
- [ ] Criar `vitest.config.ts` com path aliases
- [ ] Criar `src/lib/__tests__/utils.test.ts`
- [ ] Criar `src/lib/__tests__/date.test.ts`
- [ ] Criar `src/lib/__tests__/deal-stages.test.ts`
- [ ] Criar `src/lib/__tests__/rate-limit.test.ts`
- [ ] Migrar `tests/run-tests.tsx` para formato Vitest
- [ ] Atualizar script `test` no `package.json`
- [ ] Rodar `npx vitest run` e confirmar todos passando

---

## Referências

- Análise original: ver `walkthrough.md` no brain do Antigravity
- Plano detalhado: ver `implementation_plan.md` no brain do Antigravity
