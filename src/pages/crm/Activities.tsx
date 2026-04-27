import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { InteractionFormDialog } from "@/components/crm/InteractionFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmInteractions, useCrmPeople, useLookupMaps } from "@/hooks/use-crm";
import { CRM_FRONT_OPTIONS, CRM_INTERACTION_TYPE_OPTIONS, formatDate, frontLabel } from "@/lib/crm";

export default function Activities() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, create, remove } = useCrmInteractions();
  const { items: people } = useCrmPeople();
  const { profiles } = useLookupMaps();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !term || [item.title, item.description, item.person?.full_name, item.responsible_user?.full_name].join(" ").toLowerCase().includes(term);
      const matchesType = typeFilter === "todos" || item.type === typeFilter;
      const matchesFront = frontFilter === "todas" || item.person?.front === frontFilter;
      return matchesQuery && matchesType && matchesFront;
    });
  }, [frontFilter, items, query, typeFilter]);
  const today = new Date().toDateString();
  const todayCount = items.filter((item) => new Date(item.happened_at).toDateString() === today).length;
  const visitCount = items.filter((item) => item.type === "visita").length;
  const messageCount = items.filter((item) => item.type === "mensagem" || item.type === "ligacao").length;

  useEffect(() => {
    setFrontFilter(searchParams.get("front") || "todas");
  }, [searchParams]);

  const updateFrontUrl = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "todas") next.delete("front");
    else next.set("front", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <AppLayout greeting="Atividades">
      <CrmHero
        eyebrow="Atividades"
        title="Toda ligação, visita e oração registrada na mesma linha do cuidado."
        description="O feed operacional mostra o histórico recente de relacionamento e acompanhamento pastoral."
        actions={canEdit ? <Button disabled={people.length === 0} className="bg-white text-primary hover:bg-white/90" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova atividade</Button> : null}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Hoje</p>
          <p className="mt-2 text-2xl font-semibold">{todayCount}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Visitas registradas</p>
          <p className="mt-2 text-2xl font-semibold">{visitCount}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Contatos diretos</p>
          <p className="mt-2 text-2xl font-semibold">{messageCount}</p>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <Input placeholder="Buscar por título, pessoa, responsável ou texto..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {CRM_INTERACTION_TYPE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
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

      <div className="space-y-4">
        {loading ? <Card className="p-6">Carregando atividades...</Card> : null}
        {!loading && filtered.length === 0 ? <Card className="p-6 text-sm text-muted-foreground">Nenhuma atividade encontrada para os filtros atuais.</Card> : null}
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
                  {item.person?.front ? <span>{frontLabel(item.person.front)}</span> : null}
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
