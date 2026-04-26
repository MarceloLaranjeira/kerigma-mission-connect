import { useMemo, useState } from "react";
import { CheckSquare, Edit, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { TaskFormDialog } from "@/components/crm/TaskFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmPeople, useCrmTasks, useLookupMaps, type TaskWithRelations } from "@/hooks/use-crm";
import { formatDate, priorityTone } from "@/lib/crm";

export default function Tasks() {
  const { canEdit } = useAuth();
  const { items, loading, create, update, remove } = useCrmTasks();
  const { items: people } = useCrmPeople();
  const { profiles } = useLookupMaps();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TaskWithRelations | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => [item.title, item.description, item.person?.full_name].join(" ").toLowerCase().includes(term));
  }, [items, query]);

  return (
    <AppLayout greeting="Tarefas">
      <CrmHero
        eyebrow="Tarefas"
        title="Pendências e follow-ups da equipe em ritmo diário."
        description="A operação fica clara quando cada próximo passo ganha prazo, prioridade e responsável."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nova tarefa</Button> : null}
      />

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <Input placeholder="Buscar tarefa ou pessoa vinculada..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {loading ? <Card className="p-6">Carregando tarefas...</Card> : null}
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
