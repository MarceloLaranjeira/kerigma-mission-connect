import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Globe2 } from "lucide-react";
export default function Mundiais() {
  return (
    <PagePlaceholder
      icon={Globe2}
      title="Missões Mundiais & Transculturais"
      subtitle="Apoio a missionários e projetos fora do Brasil. Coord. Pr Roberto. Implantação de igrejas além-fronteiras."
      versiculo="“...e até aos confins da terra.” — Atos 1:8"
      stats={[
        { label: "Países Alcançados", value: "6" },
        { label: "Missionários Mundiais", value: "5" },
        { label: "Campos Transculturais", value: "3" },
        { label: "Sustento Anual", value: "R$ 96K" },
      ]}
      items={[
        { titulo: "Família Lopes — Moçambique", sub: "África · Plantação + tradução", tag: "Apadrinhada", meta: "USD 600/mês" },
        { titulo: "Missionário João Vidal", sub: "Portugal · Igreja em Lisboa", tag: "Apadrinhado", meta: "EUR 400/mês" },
        { titulo: "Projeto Janela 10/40", sub: "Parceria internacional", tag: "Parceria", meta: "Anual" },
        { titulo: "Família Tanaka — Japão", sub: "Igreja Brasil-Japão Nagoya", tag: "Em formação", meta: "Iniciar 09/26" },
        { titulo: "Campanha Mês de Missões Mundiais", sub: "Setembro · meta R$ 50K", tag: "Setembro", meta: "Planejada" },
      ]}
      ctaLabel="Novo Campo Mundial"
    />
  );
}
