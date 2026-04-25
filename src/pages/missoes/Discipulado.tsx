import { PagePlaceholder } from "@/components/PagePlaceholder";
import { BookOpen } from "lucide-react";
export default function Discipulado() {
  return (
    <PagePlaceholder
      icon={BookOpen}
      title="Acompanhamento & Discipulado"
      subtitle="Integração dos novos convertidos via Escola Bíblica Kerygma (EBK) e Grupos de Comunhão (GC)."
      stats={[
        { label: "Discípulos Ativos", value: "143" },
        { label: "EBK — Turmas", value: "8" },
        { label: "Grupos de Comunhão", value: "16" },
        { label: "Concluintes 2026", value: "27" },
      ]}
      items={[
        { titulo: "EBK Adultos · Módulo 1 — Salvação", sub: "Domingos 9h · 24 alunos · Prof. Sara", tag: "Em curso", meta: "Sem 4/12" },
        { titulo: "EBK Novos Convertidos", sub: "Quartas 19h · 18 alunos", tag: "Em curso", meta: "Sem 2/8" },
        { titulo: "GC Centro — Família Lima", sub: "Sextas 20h · 12 participantes", tag: "Ativo", meta: "Semanal" },
        { titulo: "GC Cidade Nova — Pr Daniel", sub: "Quintas 19h30 · 15 participantes", tag: "Ativo", meta: "Semanal" },
      ]}
      ctaLabel="Nova Turma / GC"
    />
  );
}
