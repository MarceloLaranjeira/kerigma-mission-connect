import { CrudPage } from "@/components/crud/CrudPage";
import { Waves } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="ribeirinhas"
      icon={Waves}
      title={`Missões Ribeirinhas`}
      subtitle={`Comunidades às margens dos rios amazônicos.`}
      versiculo={`“Ide, portanto, fazei discípulos de todas as nações” — Mateus 28:19`}
      ctaLabel={`Nova Viagem Ribeirinha`}
    />
  );
}
