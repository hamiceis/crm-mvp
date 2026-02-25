"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  CircleDollarSign,
  LayoutDashboard,
  Plug,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Contatos", icon: Users },
  { href: "/dashboard/deals", label: "Negócios", icon: CircleDollarSign },
  { href: "/dashboard/tasks", label: "Tarefas", icon: BellRing },
  { href: "/dashboard/integrations", label: "Integrações", icon: Plug },
  { href: "/dashboard/settings", label: "Preferências", icon: Settings },
];

function isActivePath(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === "/dashboard";
  return currentPath.startsWith(href);
}

export function AppNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Navegação principal">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
              active
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-200 dark:ring-brand-700"
                : "text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60 dark:focus-visible:bg-slate-800/60",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                active
                  ? "text-brand-600 dark:text-brand-300"
                  : "text-slate-500 dark:text-slate-400",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
