import { CrudPage } from "@/components/crud/CrudPage";
import { Megaphone } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="campanhas"
      icon={Megaphone}
      title={`Campanhas Missionárias`}
      subtitle={`Mês de Missões Locais (mar), Nacionais (jun), Mundiais (set) e Especiais Ribeirinhas (Cap. VI).`}
      }
      ctaLabel={`Nova Campanha`}
    />
  );
}
