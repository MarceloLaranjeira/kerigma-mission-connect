import { useState } from "react";
import { CalendarDays, Edit, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { EventFormDialog } from "@/components/crm/EventFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmEvents, useLookupMaps, type EventWithResponsible } from "@/hooks/use-crm";
import { formatDate, frontLabel } from "@/lib/crm";

export default function Agenda() {
  const { canEdit } = useAuth();
  const { items, loading, create, update, remove } = useCrmEvents();
  const { profiles } = useLookupMaps();
  const [editing, setEditing] = useState<EventWithResponsible | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <AppLayout greeting="Agenda">
      <CrmHero
        eyebrow="Agenda"
        title="Visitas, reuniões, treinamentos e viagens organizados no mesmo calendário."
        description="Cada compromisso relevante do ministério missionário entra na agenda com frente, local, período e responsável."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Novo evento</Button> : null}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {loading ? <Card className="p-6">Carregando agenda...</Card> : null}
        {items.map((event) => (
          <Card key={event.id} className="border-border/60 bg-gradient-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{event.title}</h3>
                  <Badge variant="secondary">{event.event_type}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{event.description || "Sem descrição adicional."}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{frontLabel(event.front)}</span>
                  <span>{event.location || "Sem local"}</span>
                  <span>{event.starts_at ? formatDate(event.starts_at, true) : "Sem início"}</span>
                  <span>{event.responsible_user?.full_name || "Sem responsável"}</span>
                </div>
              </div>
              {canEdit ? (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(event); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(event.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <EventFormDialog open={open} onOpenChange={setOpen} initial={editing} profiles={profiles} onSubmit={async (payload) => editing ? update(editing.id, payload) : create(payload)} />
    </AppLayout>
  );
}
