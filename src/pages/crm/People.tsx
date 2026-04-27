import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity, CalendarClock, CheckSquare, Edit, Eye, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { InteractionFormDialog } from "@/components/crm/InteractionFormDialog";
import { PersonFormDialog } from "@/components/crm/PersonFormDialog";
import { TaskFormDialog } from "@/components/crm/TaskFormDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmInteractions, useCrmPeople, useCrmTasks, useLookupMaps, type PersonWithRelations } from "@/hooks/use-crm";
import { CRM_FRONT_OPTIONS, CRM_LIFECYCLE_OPTIONS, formatDate, initials, lifecycleLabel, frontLabel } from "@/lib/crm";

export default function People() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, create, update, remove } = useCrmPeople();
  const { profiles, stages, sources } = useLookupMaps();
  const { items: interactions, create: createInteraction } = useCrmInteractions();
  const { items: tasks, create: createTask, update: updateTask } = useCrmTasks();
  const [query, setQuery] = useState("");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");
  const [lifecycleFilter, setLifecycleFilter] = useState(() => searchParams.get("lifecycle") || "todos");
  const [selected, setSelected] = useState<PersonWithRelations | null>(null);
  const [editing, setEditing] = useState<PersonWithRelations | null>(null);
  const [open, setOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) =>
      (!term || [item.full_name, item.preferred_name, item.email, item.phone, item.whatsapp, item.neighborhood, item.source?.name, item.assigned_user?.full_name]
        .join(" ")
        .toLowerCase()
        .includes(term)) &&
      (frontFilter === "todas" || item.front === frontFilter) &&
      (lifecycleFilter === "todos" || item.lifecycle_status === lifecycleFilter),
    );
  }, [frontFilter, items, lifecycleFilter, query]);

  const selectedInteractions = interactions.filter((interaction) => interaction.person_id === selected?.id).slice(0, 8);
  const selectedTasks = tasks.filter((task) => task.person_id === selected?.id).slice(0, 8);
  const selectedFront = frontFilter === "todas" ? undefined : frontFilter as PersonWithRelations["front"];
  const selectedLifecycle = lifecycleFilter === "todos" ? undefined : lifecycleFilter as PersonWithRelations["lifecycle_status"];

  useEffect(() => {
    setFrontFilter(searchParams.get("front") || "todas");
    setLifecycleFilter(searchParams.get("lifecycle") || "todos");
    if (canEdit && searchParams.get("novo") === "1") {
      setEditing(null);
      setOpen(true);
    }
  }, [canEdit, searchParams]);

  const handlePersonOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && searchParams.get("novo") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("novo");
      setSearchParams(next, { replace: true });
    }
  };

  const updateUrlFilter = (key: "front" | "lifecycle", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "todas" || value === "todos") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <AppLayout greeting="Pessoas">
      <CrmHero
        eyebrow="Pessoas"
        title="Cada visitante e cada família com histórico, responsável e próximos passos."
        description="O CRM centraliza relacionamento, origem, etapa, tarefas e atividades em um único cadastro vivo."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nova pessoa</Button> : null}
      />

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <Input placeholder="Buscar por nome, contato, bairro, origem ou responsável..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={frontFilter} onValueChange={(value) => { setFrontFilter(value); updateUrlFilter("front", value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as frentes</SelectItem>
              {CRM_FRONT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={lifecycleFilter} onValueChange={(value) => { setLifecycleFilter(value); updateUrlFilter("lifecycle", value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {CRM_LIFECYCLE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-border/60 bg-gradient-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pessoa</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Frente</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Carregando pessoas...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Nenhum registro encontrado.</TableCell></TableRow>
            ) : (
              filtered.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-white">{initials(person.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.full_name}</p>
                        <p className="text-xs text-muted-foreground">{person.email || person.whatsapp || person.phone || "Sem contato"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="border-0 bg-primary/10 text-primary">{person.stage?.name || lifecycleLabel(person.lifecycle_status)}</Badge></TableCell>
                  <TableCell>{frontLabel(person.front)}</TableCell>
                  <TableCell>{person.assigned_user?.full_name || "Sem responsável"}</TableCell>
                  <TableCell>{person.source?.name || "Manual"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setSelected(person)}><Eye className="h-4 w-4" /></Button>
                      {canEdit ? <Button size="icon" variant="ghost" onClick={() => { setEditing(person); setOpen(true); }}><Edit className="h-4 w-4" /></Button> : null}
                      {canEdit ? <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(person.id)}><Trash2 className="h-4 w-4" /></Button> : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <PersonFormDialog
        open={open}
        onOpenChange={handlePersonOpenChange}
        initial={editing}
        defaultFront={selectedFront}
        defaultLifecycle={selectedLifecycle}
        profiles={profiles}
        stages={stages}
        sources={sources}
        onSubmit={async (person, pipeline) => editing ? update(editing.id, person, pipeline) : create(person, pipeline)}
      />

      <Sheet open={!!selected} onOpenChange={(value) => !value && setSelected(null)}>
        <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.full_name}</SheetTitle>
            <SheetDescription>{selected?.email || selected?.whatsapp || selected?.phone || "Sem contato principal"}</SheetDescription>
          </SheetHeader>
          {selected ? (
            <div className="mt-6 space-y-6">
              {canEdit ? (
                <div className="flex flex-wrap gap-2">
                  <Button className="bg-gradient-primary text-white" onClick={() => setActivityOpen(true)}>
                    <Activity className="mr-2 h-4 w-4" /> Registrar atividade
                  </Button>
                  <Button variant="outline" onClick={() => setTaskOpen(true)}>
                    <CheckSquare className="mr-2 h-4 w-4" /> Criar tarefa
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(selected); setOpen(true); }}>
                    <Edit className="mr-2 h-4 w-4" /> Editar cadastro
                  </Button>
                </div>
              ) : null}

              <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-gradient-primary text-lg text-white">{initials(selected.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selected.preferred_name || selected.full_name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className="border-0 bg-primary/10 text-primary">{selected.stage?.name || lifecycleLabel(selected.lifecycle_status)}</Badge>
                      <Badge variant="secondary">{frontLabel(selected.front)}</Badge>
                      <Badge variant={selected.is_active ? "outline" : "destructive"}>{selected.is_active ? "Ativo" : "Inativo"}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Responsável</p>
                    <p className="mt-1 font-medium">{selected.assigned_user?.full_name || "Sem responsável"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Origem</p>
                    <p className="mt-1 font-medium">{selected.source?.name || "Manual"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Criado em</p>
                    <p className="mt-1 font-medium">{formatDate(selected.created_at, true)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Atualizado em</p>
                    <p className="mt-1 font-medium">{formatDate(selected.updated_at, true)}</p>
                  </div>
                </div>
                {selected.notes ? <p className="mt-4 text-sm text-muted-foreground">{selected.notes}</p> : null}
              </Card>

              <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
                <h3 className="font-semibold">Contato e endereço</h3>
                <div className="mt-4 grid gap-3">
                  <InfoLine icon={<Phone className="h-4 w-4" />} label="Telefone" value={selected.phone || selected.whatsapp} />
                  <InfoLine icon={<Mail className="h-4 w-4" />} label="E-mail" value={selected.email} />
                  <InfoLine
                    icon={<MapPin className="h-4 w-4" />}
                    label="Endereço"
                    value={[selected.address_line, selected.neighborhood, selected.city, selected.state].filter(Boolean).join(", ")}
                  />
                </div>
              </Card>

              <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
                <h3 className="font-semibold">Próximo passo</h3>
                <div className="mt-4 rounded-xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-start gap-3">
                    <CalendarClock className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{selected.pipeline_card?.next_action || "Nenhuma próxima ação definida."}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {selected.pipeline_card?.next_action_at ? formatDate(selected.pipeline_card.next_action_at, true) : "Defina uma próxima ação para manter o acompanhamento vivo."}
                      </p>
                    </div>
                  </div>
                  {selected.pipeline_card?.summary ? <p className="mt-3 text-sm text-muted-foreground">{selected.pipeline_card.summary}</p> : null}
                </div>
              </Card>

              <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
                <h3 className="font-semibold">Atividades recentes</h3>
                <ScrollArea className="mt-4 h-64">
                  <div className="space-y-3">
                    {selectedInteractions.length === 0 ? <p className="text-sm text-muted-foreground">Ainda não há atividades para esta pessoa.</p> : null}
                    {selectedInteractions.map((interaction) => (
                      <div key={interaction.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                        <p className="text-sm font-medium">{interaction.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(interaction.happened_at, true)}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
                <h3 className="font-semibold">Tarefas vinculadas</h3>
                <div className="mt-4 space-y-3">
                  {selectedTasks.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma tarefa vinculada.</p> : null}
                  {selectedTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/70 p-3">
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{task.due_at ? formatDate(task.due_at, true) : "Sem prazo"}</p>
                      </div>
                      {canEdit ? (
                        <Button size="sm" variant="outline" onClick={() => void updateTask(task.id, { status: task.status === "concluida" ? "aberta" : "concluida" })}>
                          {task.status === "concluida" ? "Reabrir" : "Concluir"}
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <InteractionFormDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        people={items}
        profiles={profiles}
        defaultPersonId={selected?.id}
        defaultResponsibleUserId={selected?.assigned_user_id}
        onSubmit={createInteraction}
      />

      <TaskFormDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        people={items}
        profiles={profiles}
        defaultPersonId={selected?.id}
        defaultResponsibleUserId={selected?.assigned_user_id}
        onSubmit={createTask}
      />
    </AppLayout>
  );
}

function InfoLine({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-3">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "Não informado"}</p>
      </div>
    </div>
  );
}
