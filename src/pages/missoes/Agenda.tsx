import { CrudPage } from "@/components/crud/CrudPage";
import { Calendar } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="agenda"
      icon={Calendar}
      title={`Agenda Missionária`}
      subtitle={`Calendário oficial — cultos, viagens, treinamentos e campanhas.`}
      }
      ctaLabel={`Novo Evento`}
    />
  );
}
