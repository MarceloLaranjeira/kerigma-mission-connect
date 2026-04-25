import { PagePlaceholder } from "@/components/PagePlaceholder";
import { UserCog } from "lucide-react";
export default function Missionarios() {
  return (
    <PagePlaceholder
      icon={UserCog}
      title="Missionários"
      subtitle="Cadastro e acompanhamento dos missionários enviados e apadrinhados pela IBK."
      stats={[
        { label: "Total Ativos", value: "38" },
        { label: "Locais", value: "17" },
        { label: "Ribeirinhos", value: "9" },
        { label: "Nacionais + Mundiais", value: "12" },
      ]}
      items={[
        { titulo: "Pr Marcos & Kelly", sub: "Coord. Ribeirinhas · Rio Negro", tag: "Ribeirinha", meta: "Desde 2019" },
        { titulo: "Alex e Isa", sub: "Coord. Nacionais · Manaus", tag: "Nacional", meta: "Desde 2021" },
        { titulo: "Pr Roberto", sub: "Coord. Mundiais", tag: "Mundial", meta: "Desde 2018" },
        { titulo: "Família Lopes", sub: "Moçambique — África", tag: "Apadrinhada", meta: "USD 600/mês" },
        { titulo: "Caio Mendes", sub: "Recife/PE", tag: "Apadrinhado", meta: "R$ 1.200/mês" },
      ]}
      ctaLabel="Cadastrar Missionário"
    />
  );
}
