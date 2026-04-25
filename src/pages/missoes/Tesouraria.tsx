import { CrudPage } from "@/components/crud/CrudPage";
import { Coins } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="tesouraria"
      icon={Coins}
      title={`Tesouraria de Missões`}
      subtitle={`Administração transparente das ofertas e contribuições missionárias (Art. 8º).`}
      versiculo={`Art. 8º — Toda contribuição será aplicada com transparência.`}
      ctaLabel={`Lançar movimento`}
    />
  );
}
