import { PagePlaceholder } from "@/components/PagePlaceholder";
import { GraduationCap } from "lucide-react";
export default function Treinamento() {
  return (
    <PagePlaceholder
      icon={GraduationCap}
      title="Capacitações & Treinamentos"
      subtitle="Formação teológica e missiológica · Treinamento para evangelismo e discipulado · Ética e segurança em campo (Cap. VII)."
      stats={[
        { label: "Treinamentos 2026", value: "12" },
        { label: "Concluintes", value: "86" },
        { label: "Próximos 30d", value: "3" },
        { label: "Certificados", value: "59" },
      ]}
      items={[
        { titulo: "Treinamento de Evangelismo Pessoal", sub: "Pr Guilherme · 03/05 · 14h", tag: "Inscrições abertas", meta: "32 vagas" },
        { titulo: "Missiologia I — Missio Dei", sub: "Pr Roberto · Mensal", tag: "Curso", meta: "8 encontros" },
        { titulo: "Segurança em Campo Ribeirinho", sub: "Pr Marcos · 25/05", tag: "Obrigatório", meta: "Equipe campo" },
        { titulo: "Discipulado prático", sub: "Sara & Agata · 11/05", tag: "Workshop", meta: "4h" },
      ]}
      ctaLabel="Novo Treinamento"
    />
  );
}
