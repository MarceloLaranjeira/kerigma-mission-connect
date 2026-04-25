import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Waves } from "lucide-react";
export default function Ribeirinhas() {
  return (
    <PagePlaceholder
      icon={Waves}
      title="Missões Ribeirinhas"
      subtitle="Evangelização, discipulado e plantação de igrejas nas comunidades às margens dos rios amazônicos."
      versiculo="“Ide, portanto, fazei discípulos de todas as nações” — Mateus 28:19"
      stats={[
        { label: "Comunidades", value: "18" },
        { label: "Missionários no Campo", value: "9" },
        { label: "Viagens em 2026", value: "7" },
        { label: "IBKs Plantadas", value: "4" },
      ]}
      items={[
        { titulo: "Comunidade Boa Esperança", sub: "Rio Negro · Pr Marcos & Kelly", tag: "Em viagem", meta: "17–22/05" },
        { titulo: "Comunidade Tefé", sub: "Solimões · Equipe sustento ativo", tag: "Apadrinhada", meta: "Mensal" },
        { titulo: "Comunidade São José do Amatari", sub: "Programação eclesiástica em curso", tag: "Ativo", meta: "Próx: 02/06" },
        { titulo: "Comunidade Manacapuru", sub: "Culto ao ar livre + ação social", tag: "Planejada", meta: "06/07" },
        { titulo: "Levantamento Rio Madeira", sub: "Visita in loco para nova IBK", tag: "Prospecção", meta: "Out/2026" },
      ]}
      ctaLabel="Nova Viagem Ribeirinha"
    />
  );
}
