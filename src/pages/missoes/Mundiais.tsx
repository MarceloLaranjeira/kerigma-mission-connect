import { CrudPage } from "@/components/crud/CrudPage";
import { Globe2 } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="mundiais"
      icon={Globe2}
      title={`Missões Mundiais`}
      subtitle={`Sustento e parcerias internacionais.`}
      }
      ctaLabel={`Novo Projeto Mundial`}
    />
  );
}
