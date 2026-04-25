import { CrudPage } from "@/components/crud/CrudPage";
import { ScrollText } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="atas"
      icon={ScrollText}
      title={`Atas & Relatórios`}
      subtitle={`Registro oficial das reuniões e relatórios mensais da Equipe de Missões.`}
      }
      ctaLabel={`Nova Ata`}
    />
  );
}
