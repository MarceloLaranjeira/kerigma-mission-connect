import { CrudPage } from "@/components/crud/CrudPage";
import { Sparkles } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="convertidos"
      icon={Sparkles}
      title={`Novos Convertidos`}
      subtitle={`Cadastro e acompanhamento dos recém-convertidos para integração à IBK.`}
      ctaLabel={`Cadastrar Convertido`}
    />
  );
}
