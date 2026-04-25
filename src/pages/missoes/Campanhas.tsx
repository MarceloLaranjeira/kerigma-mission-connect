import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Megaphone } from "lucide-react";
export default function Campanhas() {
  return (
    <PagePlaceholder
      icon={Megaphone}
      title="Campanhas Missionárias"
      subtitle="Mês de Missões Locais (março), Nacionais (junho), Mundiais (setembro) e Especiais Ribeirinhas (Cap. VI)."
      stats={[
        { label: "Campanhas 2026", value: "5" },
        { label: "Arrecadado (ano)", value: "R$ 187K" },
        { label: "Meta anual", value: "R$ 250K" },
        { label: "% atingido", value: "74,8%" },
      ]}
      items={[
        { titulo: "Mês de Missões Locais", sub: "Março/2026 · Concluído", tag: "Concluída", meta: "R$ 42.300" },
        { titulo: "Mês de Missões Nacionais", sub: "Junho/2026", tag: "Programada", meta: "Meta R$ 60K" },
        { titulo: "Mês de Missões Mundiais", sub: "Setembro/2026", tag: "Programada", meta: "Meta R$ 80K" },
        { titulo: "Campanha Especial Ribeirinha — Tefé", sub: "Aquisição de barco missionário", tag: "Em curso", meta: "R$ 28K/45K" },
      ]}
      ctaLabel="Nova Campanha"
    />
  );
}
