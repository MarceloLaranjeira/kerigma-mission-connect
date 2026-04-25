import { PagePlaceholder } from "@/components/PagePlaceholder";
import { Users } from "lucide-react";
export default function Visitantes() {
  return (
    <PagePlaceholder
      icon={Users}
      title="Visitantes"
      subtitle="Identifique os visitantes nos cultos, sente-se ao lado, ore por sua conversão e estimule sua volta à Igreja."
      stats={[
        { label: "Visitantes (mês)", value: "148" },
        { label: "Retornaram", value: "61" },
        { label: "Taxa de Retorno", value: "41,2%" },
        { label: "Pendentes contato", value: "23" },
      ]}
      items={[
        { titulo: "Roberta Lima", sub: "Culto Domingo · Convidada por Maria", tag: "1ª visita", meta: "21/04" },
        { titulo: "José e Helena", sub: "Culto Quarta · Bairro São Geraldo", tag: "2ª visita", meta: "23/04" },
        { titulo: "Família Pinheiro", sub: "Culto Jovens · 3 membros", tag: "1ª visita", meta: "20/04" },
        { titulo: "Anderson Souza", sub: "Trazido por GC Cidade Nova", tag: "3ª visita", meta: "24/04" },
      ]}
      ctaLabel="Cadastrar Visitante"
    />
  );
}
