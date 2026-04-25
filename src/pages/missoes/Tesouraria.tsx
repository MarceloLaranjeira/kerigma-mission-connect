import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Coins } from "lucide-react";
export default function Tesouraria() {
  return (
    <PagePlaceholder
      icon={Coins}
      title="Tesouraria de Missões"
      subtitle="Administração transparente das ofertas e contribuições missionárias (Art. 8º). Relatórios mensais ao Diretor."
      versiculo="Art. 8º — Toda contribuição será aplicada com transparência."
      stats={[
        { label: "Saldo Atual", value: "R$ 38.420" },
        { label: "Ofertas (mês)", value: "R$ 24.500" },
        { label: "Repasses (mês)", value: "R$ 18.700" },
        { label: "Sustento de campo", value: "R$ 12.800" },
      ]}
      items={[
        { titulo: "Oferta Missionária — 21/04", sub: "Culto Domingo · 4 envelopes + Pix", tag: "Entrada", meta: "R$ 4.820" },
        { titulo: "Repasse Família Lopes (Moçambique)", sub: "Mensal · USD 600", tag: "Saída", meta: "R$ 3.180" },
        { titulo: "Sustento Caio Mendes — Recife", sub: "Mensal", tag: "Saída", meta: "R$ 1.200" },
        { titulo: "Aquisição combustível Voadeira", sub: "Viagem Tefé", tag: "Saída", meta: "R$ 2.450" },
        { titulo: "Relatório Mensal Abril/2026", sub: "Aprovado pelo Conselho", tag: "Relatório", meta: "PDF" },
      ]}
      ctaLabel="Lançar movimento"
    />
  );
}
