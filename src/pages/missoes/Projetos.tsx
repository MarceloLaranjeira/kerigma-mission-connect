import { PagePlaceholder } from "@/components/PagePlaceholder";
import { ClipboardList } from "lucide-react";
export default function Projetos() {
  return (
    <PagePlaceholder
      icon={ClipboardList}
      title="Projetos & Viagens"
      subtitle="Planejamento, logística e execução de projetos missionários e viagens em campo."
      stats={[
        { label: "Projetos Ativos", value: "23" },
        { label: "Viagens Programadas", value: "7" },
        { label: "Em Execução", value: "4" },
        { label: "Concluídos no ano", value: "11" },
      ]}
      items={[
        { titulo: "Viagem Boa Esperança", sub: "Rio Negro · 17–22 Maio · 8 missionários", tag: "Programada", meta: "Logística OK" },
        { titulo: "Plantação IBK Cidade Nova", sub: "Em andamento · 32 membros", tag: "Plantação", meta: "Fase 2/4" },
        { titulo: "Ação Social Alvorada", sub: "12/05 · 200 cestas + pregação", tag: "Pontual", meta: "Captando" },
        { titulo: "Construção templo Tefé", sub: "Comunidade ribeirinha · meta R$ 80K", tag: "Captação", meta: "62% atingido" },
      ]}
      ctaLabel="Novo Projeto"
    />
  );
}
