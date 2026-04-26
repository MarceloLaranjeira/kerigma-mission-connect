import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrmSettings } from "@/hooks/use-crm";

export default function SettingsPage() {
  const { stages, sources, categories, createStage, createSource } = useCrmSettings();
  const [stageForm, setStageForm] = useState({ name: "", slug: "", color: "#2563eb", position: "1" });
  const [sourceForm, setSourceForm] = useState({ name: "", kind: "manual" });

  return (
    <AppLayout greeting="Configurações CRM">
      <CrmHero
        eyebrow="Configurações"
        title="Estrutura viva do CRM para pipeline, origens e categorias."
        description="Nesta primeira versão, a configuração cobre as bases que alimentam o fluxo operacional: etapas, origens e categorias financeiras."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Etapas do pipeline</h3>
          </div>
          <div className="mt-4 space-y-3">
            {stages.items.map((stage) => (
              <div key={stage.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="font-medium">{stage.position}. {stage.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stage.slug}</p>
              </div>
            ))}
          </div>
          <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={async (event) => {
            event.preventDefault();
            const ok = await createStage({
              name: stageForm.name,
              slug: stageForm.slug,
              color: stageForm.color,
              position: Number(stageForm.position || 1),
            });
            if (ok) setStageForm({ name: "", slug: "", color: "#2563eb", position: "1" });
          }}>
            <div>
              <Label>Nome</Label>
              <Input value={stageForm.name} onChange={(event) => setStageForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={stageForm.slug} onChange={(event) => setStageForm((prev) => ({ ...prev, slug: event.target.value }))} />
            </div>
            <div>
              <Label>Cor</Label>
              <Input value={stageForm.color} onChange={(event) => setStageForm((prev) => ({ ...prev, color: event.target.value }))} />
            </div>
            <div>
              <Label>Posição</Label>
              <Input type="number" value={stageForm.position} onChange={(event) => setStageForm((prev) => ({ ...prev, position: event.target.value }))} />
            </div>
            <Button type="submit" className="md:col-span-2 bg-gradient-primary text-white"><Plus className="mr-2 h-4 w-4" /> Adicionar etapa</Button>
          </form>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Origens de contato</h3>
          </div>
          <div className="mt-4 space-y-3">
            {sources.items.map((source) => (
              <div key={source.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="font-medium">{source.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{source.kind}</p>
              </div>
            ))}
          </div>
          <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={async (event) => {
            event.preventDefault();
            const ok = await createSource(sourceForm);
            if (ok) setSourceForm({ name: "", kind: "manual" });
          }}>
            <div>
              <Label>Nome</Label>
              <Input value={sourceForm.name} onChange={(event) => setSourceForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Input value={sourceForm.kind} onChange={(event) => setSourceForm((prev) => ({ ...prev, kind: event.target.value }))} />
            </div>
            <Button type="submit" className="md:col-span-2 bg-gradient-primary text-white"><Plus className="mr-2 h-4 w-4" /> Adicionar origem</Button>
          </form>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
        <h3 className="font-semibold">Categorias financeiras</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.items.map((category) => (
            <div key={category.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
              <p className="font-medium">{category.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">ordem {category.sort_order}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}
