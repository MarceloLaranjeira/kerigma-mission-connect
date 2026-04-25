import { CrudPage } from "@/components/crud/CrudPage";
import { HeartHandshake } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="nacionais"
      icon={HeartHandshake}
      title={`Missões Nacionais`}
      subtitle={`Apadrinhamento e envio de missionários por todo o Brasil.`}
      ctaLabel={`Novo Projeto Nacional`}
    />
  );
}
