import { PagePlaceholder } from "@/components/PagePlaceholder";
import { HeartHandshake } from "lucide-react";
export default function Nacionais() {
  return (
    <PagePlaceholder
      icon={HeartHandshake}
      title="Missões Nacionais"
      subtitle="Implantação de IBKs em outros estados, apadrinhamento e parcerias com missionários pelo Brasil. Coord. Alex e Isa."
      versiculo="“Como ouvirão, se não há quem pregue?” — Romanos 10:14"
      stats={[
        { label: "Estados Alcançados", value: "9" },
        { label: "Missionários Apadrinhados", value: "14" },
        { label: "IBKs Nacionais", value: "5" },
        { label: "Sustento Mensal", value: "R$ 12,8K" },
      ]}
      items={[
        { titulo: "IBK Brasília — Plano Piloto", sub: "Pr Tiago · 64 membros", tag: "Ativa", meta: "Plantada 2023" },
        { titulo: "Missionário Caio Mendes", sub: "Recife/PE · Plantação em Olinda", tag: "Apadrinhado", meta: "R$ 1.200/mês" },
        { titulo: "Família Nogueira", sub: "Cuiabá/MT · Discipulado e EBK", tag: "Apadrinhado", meta: "R$ 980/mês" },
        { titulo: "Parceria JMN — Rondônia", sub: "Indígenas Karitiana", tag: "Parceria", meta: "Semestral" },
        { titulo: "Viagem missionária SP", sub: "Equipe Alex · 6 membros", tag: "Programada", meta: "08/08" },
      ]}
      ctaLabel="Novo Apadrinhamento"
    />
  );
}
