import { PagePlaceholder } from "@/components/PagePlaceholder";
import { MapPin } from "lucide-react";
export default function Locais() {
  return (
    <PagePlaceholder
      icon={MapPin}
      title="Missões Locais"
      subtitle="Aprendizado, treinamento, evangelização, discipulado e plantação de igrejas em Manaus e comunidades próximas."
      versiculo="“E sereis minhas testemunhas tanto em Jerusalém...” — Atos 1:8"
      stats={[
        { label: "Projetos Ativos", value: "12" },
        { label: "Bairros Alcançados", value: "27" },
        { label: "Voluntários", value: "84" },
        { label: "Convertidos no mês", value: "36" },
      ]}
      items={[
        { titulo: "Evangelismo Compensa", sub: "Domingo 16h · 12 voluntários", tag: "Ativo", meta: "Próx: 28/04" },
        { titulo: "Visitação Hospital 28 de Agosto", sub: "Quartas · Equipe Pr Daniel", tag: "Ativo", meta: "Próx: 30/04" },
        { titulo: "Projeto Crianças do Coroado", sub: "Sábados 9h · Coord. Locais", tag: "Recorrente", meta: "Semanal" },
        { titulo: "Plantação IBK Cidade Nova", sub: "Em fase de cultos · 32 membros", tag: "Plantação", meta: "Iniciado 03/2025" },
        { titulo: "Ação Social Alvorada", sub: "Distribuição de cestas + pregação", tag: "Pontual", meta: "12/05" },
      ]}
      ctaLabel="Novo Projeto Local"
    />
  );
}
