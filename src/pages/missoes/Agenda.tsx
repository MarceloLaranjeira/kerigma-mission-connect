import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Calendar } from "lucide-react";
export default function Agenda() {
  return (
    <PagePlaceholder
      icon={Calendar}
      title="Agenda Missionária"
      subtitle="Calendário oficial da Equipe de Missões — cultos, viagens, treinamentos e campanhas."
      stats={[
        { label: "Eventos (mês)", value: "11" },
        { label: "Viagens", value: "2" },
        { label: "Treinamentos", value: "3" },
        { label: "Reuniões", value: "4" },
      ]}
      items={[
        { titulo: "Culto de Envio — Tefé", sub: "26/04 · 19h · IBK Central", tag: "Culto", meta: "Sex" },
        { titulo: "Treinamento de Evangelismo", sub: "03/05 · 14h · Salão Anexo", tag: "Treinamento", meta: "Sáb" },
        { titulo: "Início Mês Missões Mundiais", sub: "10/05 · Toda a Igreja", tag: "Campanha", meta: "Sáb" },
        { titulo: "Viagem Ribeirinha Boa Esperança", sub: "17–22/05 · Rio Negro", tag: "Viagem", meta: "5 dias" },
        { titulo: "Assembleia Equipe de Missões", sub: "24/05 · 16h", tag: "Reunião", meta: "Sáb" },
      ]}
      ctaLabel="Novo Evento"
    />
  );
}
