import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Sparkles } from "lucide-react";
export default function Convertidos() {
  return (
    <PagePlaceholder
      icon={Sparkles}
      title="Novos Convertidos"
      subtitle="Cadastro e acompanhamento dos recém-convertidos. Direcionamento para EBK (Escola Bíblica Kerygma) e Grupos de Comunhão."
      versiculo="“...muitas famílias se salvem, através da maravilhosa Graça de DEUS.”"
      stats={[
        { label: "Convertidos (mês)", value: "92" },
        { label: "Aguardando Visita", value: "14" },
        { label: "Em EBK", value: "37" },
        { label: "Em Grupo de Comunhão", value: "29" },
      ]}
      items={[
        { titulo: "Lucas Andrade", sub: "Culto Domingo Manhã · Bairro Adrianópolis", tag: "Acompanhar", meta: "Hoje 10:30" },
        { titulo: "Família Souza (4 pessoas)", sub: "Evangelismo Compensa · Aceitaram Jesus", tag: "Visitar", meta: "Hoje 09:15" },
        { titulo: "Marina Castro", sub: "Comunidade Boa Esperança · Direcionar EBK", tag: "EBK", meta: "Ontem" },
        { titulo: "Pedro & Ana Oliveira", sub: "GC Centro · Casal recém-convertido", tag: "Discipulado", meta: "2 dias" },
        { titulo: "Carla Mendes", sub: "Hospital · Visita Pr Daniel", tag: "Acompanhar", meta: "3 dias" },
        { titulo: "Família Ribeiro", sub: "Plantação Cidade Nova", tag: "Batismo", meta: "01/06" },
      ]}
      ctaLabel="Cadastrar Convertido"
    />
  );
}
