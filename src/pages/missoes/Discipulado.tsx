import { CrudPage } from "@/components/crud/CrudPage";
import { BookOpen } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="discipulado"
      icon={BookOpen}
      title={`Acompanhamento & Discipulado`}
      subtitle={`Integração via Escola Bíblica Kerygma (EBK) e Grupos de Comunhão (GC).`}
      ctaLabel={`Nova Turma / GC`}
    />
  );
}
