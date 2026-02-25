"use client";

import { useState } from "react";
import { updateDealStageAction } from "@/actions/crm-actions";
import { toast } from "sonner";
import {
  dealStages,
  getDealStageLabel,
  type DealStage,
} from "@/lib/deal-stages";
import { StageColumn, type Deal } from "./kanban-stage-column";

type KanbanBoardProps = {
  initialDeals: Deal[];
};

export function KanbanBoard({ initialDeals }: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [draggingDealId, setDraggingDealId] = useState<string | null>(null);

  const onDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("dealId", dealId);
    setDraggingDealId(dealId);
  };

  const onDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) setDragOverStage(stage);
  };

  const onDragLeave = () => {
    setDragOverStage(null);
  };

  const onDragEnd = () => {
    setDragOverStage(null);
    setDraggingDealId(null);
  };

  const handleMoveDeal = async (dealId: string, newStage: DealStage) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === newStage) return;

    // Optimistic update
    const previousDeals = [...deals];
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)),
    );

    try {
      await updateDealStageAction(dealId, newStage);
      toast.success(`Negócio movido para ${getDealStageLabel(newStage)}`);
    } catch {
      setDeals(previousDeals);
      toast.error("Erro ao mover negócio");
    } finally {
      setDraggingDealId(null);
    }
  };

  const onDrop = async (e: React.DragEvent, newStage: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId = e.dataTransfer.getData("dealId");
    await handleMoveDeal(dealId, newStage);
  };

  return (
    <div className="flex flex-col min-h-[600px] h-full pb-8">
      <p className="mb-3 px-1 text-xs font-medium text-slate-500 dark:text-slate-300">
        Arraste e solte os cards entre as etapas do funil.
      </p>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
        {dealStages.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            deals={deals}
            dragOverStage={dragOverStage}
            draggingDealId={draggingDealId}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMove={handleMoveDeal}
          />
        ))}
      </div>
    </div>
  );
}
