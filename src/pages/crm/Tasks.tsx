import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckSquare, Edit, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { TaskFormDialog } from "@/components/crm/TaskFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmPeople, useCrmTasks, useLookupMaps, type TaskWithRelations } from "@/hooks/use-crm";
import { CRM_FRONT_OPTIONS, CRM_PRIORITY_OPTIONS, CRM_TASK_STATUS_OPTIONS, formatDate, frontLabel, priorityTone } from "@/lib/crm";

export default function Tasks() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, create, update, remove } = useCrmTasks();
  const { items: people } = useCrmPeople();
  const { profiles } = useLookupMaps();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ativas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");
  const [editing, setEditing] = useState<TaskWithRelations | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !term || [item.title, item.description, item.person?.full_name, item.responsible_user?.full_name].join(" ").toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "todas" ||
        (statusFilter === "ativas" ? item.status === "aberta" || item.status === "em_andamento" : item.status === statusFilter);
      const matchesPriority = priorityFilter === "todas" || item.priority === priorityFilter;
      const matchesFront = frontFilter === "todas" || item.person?.front === frontFilter;
      return matchesQuery && matchesStatus && matchesPriority && matchesFront;
    });
  }, [frontFilter, items, priorityFilter, query, statusFilter]);
  const openTasks = items.filter((task) => task.status === "aberta" || task.status === "em_andamento").length;
  const overdueTasks = items.filter((task) => task.due_at && task.status !== "concluida" && new Date(task.due_at) < new Date()).length;
  const completedTasks = items.filter((task) => task.status === "concluida").length;

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
    <AppLayout greeting="Tarefas">
      <CrmHero
        eyebrow="Tarefas"
        title="Pendências e follow-ups da equipe em ritmo diário."
        description="A operação fica clara quando cada próximo passo ganha prazo, prioridade e responsável."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nova tarefa</Button> : null}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Tarefas ativas</p>
          <p className="mt-2 text-2xl font-semibold">{openTasks}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Atrasadas</p>
          <p className="mt-2 text-2xl font-semibold">{overdueTasks}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Concluídas</p>
          <p className="mt-2 text-2xl font-semibold">{completedTasks}</p>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_220px]">
          <Input placeholder="Buscar tarefa, pessoa ou responsável..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativas">Ativas</SelectItem>
              <SelectItem value="todas">Todas</SelectItem>
              {CRM_TASK_STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas prioridades</SelectItem>
              {CRM_PRIORITY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
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
        {loading ? <Card className="p-6">Carregando tarefas...</Card> : null}
        {!loading && filtered.length === 0 ? <Card className="p-6 text-sm text-muted-foreground">Nenhuma tarefa encontrada para os filtros atuais.</Card> : null}
        {filtered.map((task) => (
          <Card key={task.id} className="border-border/60 bg-gradient-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{task.title}</h3>
                  <Badge variant="secondary">{task.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{task.description || "Sem descrição adicional."}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{task.person?.full_name || "Sem pessoa vinculada"}</span>
                  {task.person?.front ? <span>{frontLabel(task.person.front)}</span> : null}
                  <span>{task.responsible_user?.full_name || "Sem responsável"}</span>
                  <span className={priorityTone(task.priority)}>{task.priority}</span>
                  <span>{task.due_at ? formatDate(task.due_at, true) : "Sem prazo"}</span>
                </div>
              </div>
              {canEdit ? (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(task); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => void update(task.id, { status: task.status === "concluida" ? "aberta" : "concluida" })}><CheckSquare className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(task.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <TaskFormDialog open={open} onOpenChange={setOpen} initial={editing} people={people} profiles={profiles} onSubmit={async (payload) => editing ? update(editing.id, payload) : create(payload)} />
    </AppLayout>
  );
}
