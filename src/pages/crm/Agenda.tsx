import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { EventFormDialog } from "@/components/crm/EventFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmEvents, useLookupMaps, type EventWithResponsible } from "@/hooks/use-crm";
import { CRM_EVENT_TYPE_OPTIONS, CRM_FRONT_OPTIONS, formatDate, frontLabel } from "@/lib/crm";
import { type TablesInsert } from "@/integrations/supabase/types";

export default function Agenda() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, create, update, remove } = useCrmEvents();
  const { profiles } = useLookupMaps();
  const [editing, setEditing] = useState<EventWithResponsible | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");

  const now = new Date();
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((event) => {
      const matchesQuery = !term || [event.title, event.description, event.location, event.responsible_user?.full_name].join(" ").toLowerCase().includes(term);
      const matchesType = typeFilter === "todos" || event.event_type === typeFilter;
      const matchesFront = frontFilter === "todas" || event.front === frontFilter;
      return matchesQuery && matchesType && matchesFront;
    });
  }, [frontFilter, items, query, typeFilter]);
  const upcoming = items.filter((event) => event.starts_at && new Date(event.starts_at) >= now).length;
  const today = items.filter((event) => event.starts_at && new Date(event.starts_at).toDateString() === now.toDateString()).length;
  const visits = items.filter((event) => event.event_type === "visita" || event.event_type === "evangelismo").length;
  const selectedFront = frontFilter === "todas" ? undefined : frontFilter as TablesInsert<"crm_events">["front"];

  useEffect(() => {
    setFrontFilter(searchParams.get("front") || "todas");
    if (canEdit && searchParams.get("novo") === "1") {
      setEditing(null);
      setOpen(true);
    }
  }, [canEdit, searchParams]);

  const handleEventOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && searchParams.get("novo") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("novo");
      setSearchParams(next, { replace: true });
    }
  };

  const updateFrontUrl = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "todas") next.delete("front");
    else next.set("front", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <AppLayout greeting="Agenda">
      <CrmHero
        eyebrow="Agenda"
        title="Visitas, reuniões, treinamentos e viagens organizados no mesmo calendário."
        description="Cada compromisso relevante do ministério missionário entra na agenda com frente, local, período e responsável."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Novo evento</Button> : null}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Próximos eventos</p>
          <p className="mt-2 text-2xl font-semibold">{upcoming}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Hoje</p>
          <p className="mt-2 text-2xl font-semibold">{today}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Visitas e evangelismos</p>
          <p className="mt-2 text-2xl font-semibold">{visits}</p>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <Input placeholder="Buscar evento, local ou responsável..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {CRM_EVENT_TYPE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={frontFilter} onValueChange={(value) => { setFrontFilter(value); updateFrontUrl(value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as frentes</SelectItem>
              {CRM_FRONT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {loading ? <Card className="p-6">Carregando agenda...</Card> : null}
        {!loading && filtered.length === 0 ? <Card className="p-6 text-sm text-muted-foreground">Nenhum evento encontrado para os filtros atuais.</Card> : null}
        {filtered.map((event) => (
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
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location || "Sem local"}</span>
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

      <EventFormDialog open={open} onOpenChange={handleEventOpenChange} initial={editing} defaultFront={selectedFront} profiles={profiles} onSubmit={async (payload) => editing ? update(editing.id, payload) : create(payload)} />
    </AppLayout>
  );
}
