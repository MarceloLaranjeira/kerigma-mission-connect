import { PagePlaceholder } from "@/components/PagePlaceholder";
import { ScrollText } from "lucide-react";
export default function Atas() {
  return (
    <PagePlaceholder
      icon={ScrollText}
      title="Atas & Relatórios"
      subtitle="Registros de reuniões, atas, relatórios ministeriais e correspondências (Secretaria Administrativa — Sara e Agata)."
      stats={[
        { label: "Atas (ano)", value: "14" },
        { label: "Relatórios", value: "6" },
        { label: "Pendentes assinatura", value: "2" },
        { label: "Documentos", value: "78" },
      ]}
      items={[
        { titulo: "Ata Reunião Equipe — 18/04", sub: "Pauta: viagem Tefé, campanha Mundiais", tag: "Assinada", meta: "PDF" },
        { titulo: "Relatório Ministerial Mar/2026", sub: "Mês de Missões Locais", tag: "Concluído", meta: "PDF" },
        { titulo: "Ata Reunião — 04/04", sub: "Apresentação Pr Roberto · Mundiais", tag: "Assinada", meta: "PDF" },
        { titulo: "Planejamento Anual 2026", sub: "Aprovado em assembleia", tag: "Documento", meta: "PDF" },
      ]}
      ctaLabel="Nova Ata"
    />
  );
}
