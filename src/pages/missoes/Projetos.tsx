import { CrudPage } from "@/components/crud/CrudPage";
import { ClipboardList } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="projetos"
      icon={ClipboardList}
      title={`Projetos & Viagens`}
      subtitle={`Planejamento, logística e execução de projetos missionários e viagens em campo.`}
      }
      ctaLabel={`Novo Projeto`}
    />
  );
}
