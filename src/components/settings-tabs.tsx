"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { User, Shield, Settings, History, Users } from "lucide-react";
import Link from "next/link";

type TabType = "profile" | "security" | "preferences" | "audit";

type SettingsTabsProps = {
  isAdmin: boolean;
  children: {
    profile: React.ReactNode;
    security: React.ReactNode;
    preferences: React.ReactNode;
    audit: React.ReactNode;
  };
};

export function SettingsTabs({ isAdmin, children }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "preferences", label: "Preferências", icon: Settings },
    { id: "audit", label: "Auditoria", icon: History },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Mobile Select */}
      <div className="flex flex-col gap-4 md:hidden">
        <Select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as TabType)}
          className="font-semibold text-slate-700 dark:text-slate-200"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </Select>

        {isAdmin && (
          <Link
            href="/dashboard/settings/users"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors w-full shadow-sm"
          >
            <Users className="h-4 w-4" />
            Gerenciar Equipe
          </Link>
        )}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex items-center justify-between gap-4 border-b border-slate-200 pb-1 dark:border-slate-800">
        <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "border-brand-500 text-brand-600 dark:text-brand-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <Link
            href="/dashboard/settings/users"
            className="mb-1 flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Users className="h-4 w-4" />
            Gerenciar Equipe
          </Link>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "profile" && children.profile}
        {activeTab === "security" && children.security}
        {activeTab === "preferences" && children.preferences}
        {activeTab === "audit" && children.audit}
      </div>
    </div>
  );
}
