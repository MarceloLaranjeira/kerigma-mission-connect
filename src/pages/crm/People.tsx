import { useMemo, useState } from "react";
import { Edit, Eye, Plus, Trash2, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { PersonFormDialog } from "@/components/crm/PersonFormDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmInteractions, useCrmPeople, useCrmTasks, useLookupMaps, type PersonWithRelations } from "@/hooks/use-crm";
import { formatDate, initials, lifecycleLabel, frontLabel } from "@/lib/crm";

export default function People() {
  const { canEdit } = useAuth();
  const { items, loading, create, update, remove } = useCrmPeople();
  const { profiles, stages, sources } = useLookupMaps();
  const { items: interactions } = useCrmInteractions();
  const { items: tasks } = useCrmTasks();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PersonWithRelations | null>(null);
  const [editing, setEditing] = useState<PersonWithRelations | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.full_name, item.preferred_name, item.email, item.phone, item.whatsapp, item.neighborhood]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [items, query]);

  const selectedInteractions = interactions.filter((interaction) => interaction.person_id === selected?.id).slice(0, 6);
  const selectedTasks = tasks.filter((task) => task.person_id === selected?.id).slice(0, 6);

  return (
    <AppLayout greeting="Pessoas">
      <CrmHero
        eyebrow="Pessoas"
        title="Cada visitante e cada família com histórico, responsável e próximos passos."
        description="O CRM centraliza relacionamento, origem, etapa, tarefas e atividades em um único cadastro vivo."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nova pessoa</Button> : null}
      />

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <Input placeholder="Buscar por nome, contato, bairro ou origem..." value={query} onChange={(event) => setQuery(event.target.value)} />
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
        onOpenChange={setOpen}
        initial={editing}
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
              <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Etapa</p>
                    <p className="mt-1 font-medium">{selected.stage?.name || lifecycleLabel(selected.lifecycle_status)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Frente</p>
                    <p className="mt-1 font-medium">{frontLabel(selected.front)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Responsável</p>
                    <p className="mt-1 font-medium">{selected.assigned_user?.full_name || "Sem responsável"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Origem</p>
                    <p className="mt-1 font-medium">{selected.source?.name || "Manual"}</p>
                  </div>
                </div>
                {selected.notes ? <p className="mt-4 text-sm text-muted-foreground">{selected.notes}</p> : null}
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
                    <div key={task.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{task.due_at ? formatDate(task.due_at, true) : "Sem prazo"}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
