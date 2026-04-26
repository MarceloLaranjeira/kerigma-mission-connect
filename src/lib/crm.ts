import { type Enums } from "@/integrations/supabase/types";

export const CRM_FRONT_OPTIONS: { value: Enums<"crm_front">; label: string }[] = [
  { value: "geral", label: "Geral" },
  { value: "locais", label: "Missões Locais" },
  { value: "ribeirinhas", label: "Ribeirinhas" },
  { value: "nacionais", label: "Nacionais" },
  { value: "mundiais", label: "Mundiais" },
  { value: "discipulado", label: "Discipulado" },
  { value: "treinamento", label: "Treinamento" },
  { value: "tesouraria", label: "Tesouraria" },
];

export const CRM_LIFECYCLE_OPTIONS: { value: Enums<"crm_lifecycle_status">; label: string }[] = [
  { value: "visitante", label: "Visitante" },
  { value: "primeiro_contato", label: "Primeiro Contato" },
  { value: "acompanhamento", label: "Acompanhamento" },
  { value: "discipulado", label: "Discipulado" },
  { value: "membro", label: "Membro" },
  { value: "voluntario", label: "Voluntário" },
  { value: "missionario", label: "Missionário" },
  { value: "inativo", label: "Inativo" },
];

export const CRM_PRIORITY_OPTIONS: { value: Enums<"crm_priority">; label: string }[] = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

export const CRM_TASK_STATUS_OPTIONS: { value: Enums<"crm_task_status">; label: string }[] = [
  { value: "aberta", label: "Aberta" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export const CRM_EVENT_TYPE_OPTIONS: { value: Enums<"crm_event_type">; label: string }[] = [
  { value: "visita", label: "Visita" },
  { value: "treinamento", label: "Treinamento" },
  { value: "campanha", label: "Campanha" },
  { value: "culto", label: "Culto" },
  { value: "reuniao", label: "Reunião" },
  { value: "viagem", label: "Viagem" },
  { value: "evangelismo", label: "Evangelismo" },
];

export const CRM_CAMPAIGN_STATUS_OPTIONS: { value: Enums<"crm_campaign_status">; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "ativa", label: "Ativa" },
  { value: "pausada", label: "Pausada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export const CRM_FINANCIAL_TYPE_OPTIONS: { value: Enums<"crm_financial_type">; label: string }[] = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
];

export const CRM_INTERACTION_TYPE_OPTIONS: { value: Enums<"crm_interaction_type">; label: string }[] = [
  { value: "ligacao", label: "Ligação" },
  { value: "visita", label: "Visita" },
  { value: "oracao", label: "Oração" },
  { value: "reuniao", label: "Reunião" },
  { value: "culto", label: "Culto" },
  { value: "mensagem", label: "Mensagem" },
  { value: "decisao", label: "Decisão" },
  { value: "discipulado", label: "Discipulado" },
  { value: "nota", label: "Nota" },
];

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", withTime
    ? { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function formatDateInput(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function lifecycleLabel(value: Enums<"crm_lifecycle_status">) {
  return CRM_LIFECYCLE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function frontLabel(value: Enums<"crm_front">) {
  return CRM_FRONT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function priorityTone(value: Enums<"crm_priority">) {
  switch (value) {
    case "urgente":
      return "text-destructive";
    case "alta":
      return "text-warning";
    case "media":
      return "text-accent";
    default:
      return "text-muted-foreground";
  }
}
