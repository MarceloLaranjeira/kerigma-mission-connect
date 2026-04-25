import { CrudPage } from "@/components/crud/CrudPage";
import { MapPin } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="locais"
      icon={MapPin}
      title={`Missões Locais`}
      subtitle={`Aprendizado, treinamento, evangelização, discipulado e plantação de igrejas em Manaus.`}
      versiculo={`“E sereis minhas testemunhas tanto em Jerusalém...” — Atos 1:8`}
      ctaLabel={`Novo Projeto Local`}
    />
  );
}
