import { CrudPage } from "@/components/crud/CrudPage";
import { Users } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="visitantes"
      icon={Users}
      title={`Visitantes`}
      subtitle={`Registro de visitantes dos cultos e eventos.`}
      }
      ctaLabel={`Cadastrar Visitante`}
    />
  );
}
