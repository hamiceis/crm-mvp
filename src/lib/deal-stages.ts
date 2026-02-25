import { DealStage } from "@prisma/client";

export const dealStages = [
  DealStage.LEAD,
  DealStage.QUALIFIED,
  DealStage.PROPOSAL,
  DealStage.NEGOTIATION,
  DealStage.WON,
  DealStage.LOST,
] as const;

export type { DealStage };

export const dealStageLabels: Record<DealStage, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualificado",
  PROPOSAL: "Proposta",
  NEGOTIATION: "Negociação",
  WON: "Ganho",
  LOST: "Perdido",
};

export const defaultDealStage = DealStage.LEAD;

export const getDealStageLabel = (stage: string | DealStage) =>
  (dealStageLabels as Record<string, string>)[stage] || stage;
