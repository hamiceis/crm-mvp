"use client";

import type { DragEvent } from "react";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { currencyFromCents } from "@/lib/utils";
import { dealStageLabels, dealStages, type DealStage } from "@/lib/deal-stages";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Deal = {
  id: string;
  title: string;
  stage: DealStage;
  value: number;
};

type StageColumnProps = {
  stage: DealStage;
  deals: Deal[];
  dragOverStage: DealStage | null;
  draggingDealId: string | null;
  onDragOver: (event: DragEvent<HTMLElement>, stage: DealStage) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLElement>, stage: DealStage) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, dealId: string) => void;
  onDragEnd: () => void;
  onMove: (dealId: string, stage: DealStage) => void;
};

type DealCardProps = {
  deal: Deal;
  draggingDealId: string | null;
  onDragStart: (event: DragEvent<HTMLDivElement>, dealId: string) => void;
  onDragEnd: () => void;
  onMove: (dealId: string, stage: DealStage) => void;
};

function DealCard({
  deal,
  draggingDealId,
  onDragStart,
  onDragEnd,
  onMove,
}: DealCardProps) {
  const isDragging = draggingDealId === deal.id;
  return (
    <div
      key={deal.id}
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onDragEnd={onDragEnd}
      className={`group rounded-xl border bg-white p-4 shadow-sm transition-all dark:bg-slate-900 ${
        isDragging
          ? "cursor-grabbing border-brand-300 opacity-70 ring-2 ring-brand-200 dark:border-brand-700 dark:ring-brand-900"
          : "cursor-grab border-slate-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-slate-800 dark:hover:border-brand-800"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-400 leading-tight">
          {deal.title}
        </p>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 p-1.5 flex flex-col gap-1"
            >
              <span className="px-2 py-1.5 text-xs font-bold text-slate-500">
                Mover para...
              </span>
              {dealStages.map((stage) => {
                if (stage === deal.stage) return null;
                return (
                  <button
                    key={stage}
                    onClick={() => onMove(deal.id, stage)}
                    className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    {dealStageLabels[stage]}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          <GripVertical className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500 dark:text-slate-600 dark:group-hover:text-brand-400 hidden md:block cursor-grab" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {currencyFromCents(deal.value)}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">
          #ID-{deal.id.slice(-4)}
        </span>
      </div>
    </div>
  );
}

export function StageColumn({
  stage,
  deals,
  dragOverStage,
  draggingDealId,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onMove,
}: StageColumnProps) {
  const isActive = dragOverStage === stage;
  const stageDeals = deals.filter((deal) => deal.stage === stage);

  return (
    <div
      onDragOver={(event) => onDragOver(event, stage)}
      onDragLeave={onDragLeave}
      onDrop={(event) => onDrop(event, stage)}
      className={`flex w-full flex-col rounded-2xl border p-3 transition-all ${
        isActive
          ? "border-brand-300 bg-brand-50/70 shadow-md ring-2 ring-brand-200 ring-inset dark:border-brand-700 dark:bg-brand-900/20 dark:ring-brand-900"
          : "border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2.5 shadow-sm dark:bg-slate-950/70">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {dealStageLabels[stage]}
        </h3>
        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {stageDeals.length}
        </span>
      </div>

      <div className="flex min-h-[170px] max-h-[calc(100vh-320px)] flex-1 flex-col gap-3 rounded-xl border border-dashed border-transparent p-1 overflow-y-auto">
        {stageDeals.length === 0 ? (
          <div
            className={`mt-1 rounded-xl border border-dashed px-3 py-8 text-center text-xs font-medium transition-colors ${
              isActive
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                : "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
            }`}
          >
            Nenhum negócio aqui.
            <br />
            Solte para mover.
          </div>
        ) : null}

        {stageDeals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            draggingDealId={draggingDealId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}
