import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity, CalendarClock, CheckSquare, ChevronLeft, ChevronRight, Edit, GitBranch, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { InteractionFormDialog } from "@/components/crm/InteractionFormDialog";
import { TaskFormDialog } from "@/components/crm/TaskFormDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmInteractions, useCrmPeople, useCrmPipeline, useCrmTasks, useLookupMaps, nextStageId, type CrmPerson, type CrmPipelineCard, type SimpleProfile } from "@/hooks/use-crm";
import { CRM_FRONT_OPTIONS, CRM_PRIORITY_OPTIONS, formatDate, frontLabel, initials, priorityTone } from "@/lib/crm";

type PipelineCardWithRelations = CrmPipelineCard & {
  person: CrmPerson | null;
  assigned_user: SimpleProfile | null;
};

export default function Pipeline() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stages, cards, loading, moveCard, updateCard } = useCrmPipeline();
  const { items: people } = useCrmPeople();
  const { profiles } = useLookupMaps();
  const { create: createInteraction } = useCrmInteractions();
  const { create: createTask } = useCrmTasks();
  const [editing, setEditing] = useState<PipelineCardWithRelations | null>(null);
  const [actionCard, setActionCard] = useState<PipelineCardWithRelations | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");
  const filteredCards = useMemo(() => {
    const term = query.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesQuery = !term || [
        card.person?.full_name,
        card.assigned_user?.full_name,
        card.summary,
        card.next_action,
        card.priority,
      ].join(" ").toLowerCase().includes(term);
      const matchesFront = frontFilter === "todas" || card.person?.front === frontFilter;
      return matchesQuery && matchesFront;
    });
  }, [cards, frontFilter, query]);
  const grouped = useMemo(
    () => stages.map((stage) => ({ ...stage, cards: filteredCards.filter((card) => card.stage_id === stage.id) })),
    [filteredCards, stages],
  );
  const overdue = cards.filter((card) => card.next_action_at && new Date(card.next_action_at) < new Date()).length;
  const withNextAction = cards.filter((card) => card.next_action || card.next_action_at).length;

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
    <AppLayout greeting="Pipeline">
      <CrmHero
        eyebrow="Pipeline"
        title="O funil de relacionamento da igreja com visual de operação real."
        description="Mova pessoas entre etapas, identifique gargalos e defina o próximo passo sem sair do quadro."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Cards no pipeline</p>
          <p className="mt-2 text-2xl font-semibold">{cards.length}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Com próximo passo</p>
          <p className="mt-2 text-2xl font-semibold">{withNextAction}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Ações vencidas</p>
          <p className="mt-2 text-2xl font-semibold">{overdue}</p>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por pessoa, responsável, resumo ou próximo passo..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Select value={frontFilter} onValueChange={(value) => { setFrontFilter(value); updateFrontUrl(value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as frentes</SelectItem>
              {CRM_FRONT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? <Card className="p-6">Carregando pipeline...</Card> : null}

      <section className="grid gap-4 xl:grid-cols-3">
        {grouped.map((stage) => (
          <Card key={stage.id} className="border-border/60 bg-gradient-card p-4 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{stage.name}</h3>
                <p className="text-sm text-muted-foreground">{stage.cards.length} pessoas</p>
              </div>
              <GitBranch className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3">
              {stage.cards.length === 0 ? <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">Sem cards nesta etapa.</p> : null}
              {stage.cards.map((card) => (
                <div key={card.id} className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-white">{initials(card.person?.full_name ?? "CRM")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{card.person?.full_name || "Pessoa sem nome"}</p>
                        <p className={`text-xs font-medium ${priorityTone(card.priority)}`}>Prioridade {card.priority}</p>
                      </div>
                    </div>
                    {canEdit ? <Button size="icon" variant="ghost" onClick={() => setEditing(card)}><Edit className="h-4 w-4" /></Button> : null}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{card.summary || "Resumo ainda não definido."}</p>
                  <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-start gap-2">
                      <CalendarClock className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{card.next_action || "Próxima ação não definida"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{card.next_action_at ? formatDate(card.next_action_at, true) : "Sem prazo"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary">{card.assigned_user?.full_name || "Sem responsável"}</Badge>
                    {card.person?.front ? <Badge variant="outline">{frontLabel(card.person.front)}</Badge> : null}
                    {canEdit ? (
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" disabled={!nextStageId(stages, card.stage_id, "prev")} onClick={() => {
                          const target = nextStageId(stages, card.stage_id, "prev");
                          if (target) void moveCard(card, target);
                        }}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" disabled={!nextStageId(stages, card.stage_id, "next")} onClick={() => {
                          const target = nextStageId(stages, card.stage_id, "next");
                          if (target) void moveCard(card, target);
                        }}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  {canEdit ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" disabled={!card.person_id} onClick={() => { setActionCard(card); setActivityOpen(true); }}>
                        <Activity className="mr-2 h-4 w-4" /> Atividade
                      </Button>
                      <Button size="sm" variant="outline" disabled={!card.person_id} onClick={() => { setActionCard(card); setTaskOpen(true); }}>
                        <CheckSquare className="mr-2 h-4 w-4" /> Tarefa
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <PipelineCardDialog open={!!editing} onOpenChange={(value) => !value && setEditing(null)} card={editing} stages={stages} onSubmit={async (payload) => editing ? updateCard(editing.id, payload) : false} />

      <InteractionFormDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        people={people}
        profiles={profiles}
        defaultPersonId={actionCard?.person_id}
        defaultResponsibleUserId={actionCard?.assigned_user_id}
        onSubmit={createInteraction}
      />

      <TaskFormDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        people={people}
        profiles={profiles}
        defaultPersonId={actionCard?.person_id}
        defaultResponsibleUserId={actionCard?.assigned_user_id}
        onSubmit={createTask}
      />
    </AppLayout>
  );
}

function PipelineCardDialog({
  open,
  onOpenChange,
  card,
  stages,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  card: (CrmPipelineCard & { person: { full_name: string } | null }) | null;
  stages: { id: string; name: string }[];
  onSubmit: (payload: Partial<CrmPipelineCard>) => Promise<boolean>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ summary: "", next_action: "", next_action_at: "", priority: "media", stage_id: "" });

  useEffect(() => {
    if (!card) return;
    setForm({
      summary: card.summary ?? "",
      next_action: card.next_action ?? "",
      next_action_at: card.next_action_at ? new Date(card.next_action_at).toISOString().slice(0, 16) : "",
      priority: card.priority,
      stage_id: card.stage_id,
    });
  }, [card]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      summary: form.summary || null,
      next_action: form.next_action || null,
      next_action_at: form.next_action_at ? new Date(form.next_action_at).toISOString() : null,
      priority: form.priority as CrmPipelineCard["priority"],
      stage_id: form.stage_id,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar card</DialogTitle>
          <DialogDescription>{card?.person?.full_name}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Etapa</Label>
            <Select value={form.stage_id} onValueChange={(value) => setForm((prev) => ({ ...prev, stage_id: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map((stage) => <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Select value={form.priority} onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CRM_PRIORITY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Resumo</Label>
            <Textarea rows={3} value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} />
          </div>
          <div>
            <Label>Próxima ação</Label>
            <Textarea rows={3} value={form.next_action} onChange={(event) => setForm((prev) => ({ ...prev, next_action: event.target.value }))} />
          </div>
          <div>
            <Label>Data da próxima ação</Label>
            <Input type="datetime-local" value={form.next_action_at} onChange={(event) => setForm((prev) => ({ ...prev, next_action_at: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : "Salvar card"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
