import { CrudPage } from "@/components/crud/CrudPage";
import { UserCog } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="missionarios"
      icon={UserCog}
      title={`Missionários`}
      subtitle={`Cadastro e acompanhamento dos missionários enviados e apadrinhados pela IBK.`}
      }
      ctaLabel={`Cadastrar Missionário`}
    />
  );
}
