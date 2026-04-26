import { useMemo, useState } from "react";
import { Activity, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { InteractionFormDialog } from "@/components/crm/InteractionFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmInteractions, useCrmPeople, useLookupMaps } from "@/hooks/use-crm";
import { formatDate } from "@/lib/crm";

export default function Activities() {
  const { canEdit } = useAuth();
  const { items, loading, create, remove } = useCrmInteractions();
  const { items: people } = useCrmPeople();
  const { profiles } = useLookupMaps();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => [item.title, item.description, item.person?.full_name].join(" ").toLowerCase().includes(term));
  }, [items, query]);

  return (
    <AppLayout greeting="Atividades">
      <CrmHero
        eyebrow="Atividades"
        title="Toda ligação, visita e oração registrada na mesma linha do cuidado."
        description="O feed operacional mostra o histórico recente de relacionamento e acompanhamento pastoral."
        actions={canEdit ? <Button disabled={people.length === 0} className="bg-white text-primary hover:bg-white/90" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova atividade</Button> : null}
      />

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <Input placeholder="Buscar atividades por título, pessoa ou texto..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </Card>

      <div className="space-y-4">
        {loading ? <Card className="p-6">Carregando atividades...</Card> : null}
        {filtered.map((item) => (
          <Card key={item.id} className="border-border/60 bg-gradient-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description || "Sem descrição adicional."}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{item.person?.full_name || "Pessoa não encontrada"}</span>
                  <span>{item.responsible_user?.full_name || "Sem responsável"}</span>
                  <span>{formatDate(item.happened_at, true)}</span>
                </div>
              </div>
              {canEdit ? <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(item.id)}><Trash2 className="h-4 w-4" /></Button> : null}
            </div>
          </Card>
        ))}
      </div>

      <InteractionFormDialog open={open} onOpenChange={setOpen} people={people} profiles={profiles} onSubmit={create} />
    </AppLayout>
  );
}
