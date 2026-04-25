import { CrudPage } from "@/components/crud/CrudPage";
import { GraduationCap } from "lucide-react";
export default function Page() {
  return (
    <CrudPage
      type="treinamento"
      icon={GraduationCap}
      title={`Capacitações & Treinamentos`}
      subtitle={`Formação teológica e missiológica · Cap. VII.`}
      ctaLabel={`Novo Treinamento`}
    />
  );
}
