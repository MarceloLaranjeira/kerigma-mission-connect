import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CRM_PRIORITY_OPTIONS, CRM_TASK_STATUS_OPTIONS, formatDateInput } from "@/lib/crm";
import { type CrmPerson, type SimpleProfile, type TaskWithRelations } from "@/hooks/use-crm";
import { type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initial?: TaskWithRelations | null;
  defaultPersonId?: string;
  defaultResponsibleUserId?: string | null;
  people: CrmPerson[];
  profiles: SimpleProfile[];
  onSubmit: (payload: TablesInsert<"crm_tasks"> | TablesUpdate<"crm_tasks">) => Promise<boolean>;
}

export function TaskFormDialog({ open, onOpenChange, initial, defaultPersonId, defaultResponsibleUserId, people, profiles, onSubmit }: TaskFormDialogProps) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    person_id: "",
    responsible_user_id: "",
    due_at: "",
    priority: "media",
    status: "aberta",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      person_id: initial?.person_id ?? defaultPersonId ?? "",
      responsible_user_id: initial?.responsible_user_id ?? defaultResponsibleUserId ?? "",
      due_at: formatDateInput(initial?.due_at),
      priority: initial?.priority ?? "media",
      status: initial?.status ?? "aberta",
    });
  }, [defaultPersonId, defaultResponsibleUserId, initial, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      title: form.title.trim(),
      description: form.description || null,
      person_id: form.person_id || null,
      responsible_user_id: form.responsible_user_id || null,
      due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
      priority: form.priority as TablesInsert<"crm_tasks">["priority"],
      status: form.status as TablesInsert<"crm_tasks">["status"],
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>Organize follow-ups, visitas, reuniões e pendências da equipe.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Título</Label>
              <Input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div>
              <Label>Prazo</Label>
              <Input type="datetime-local" value={form.due_at} onChange={(event) => setForm((prev) => ({ ...prev, due_at: event.target.value }))} />
            </div>
            <div>
              <Label>Pessoa vinculada</Label>
              <Select value={form.person_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, person_id: value === "none" ? "" : value }))}>
                <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem vínculo</SelectItem>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>{person.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Responsável</Label>
              <Select value={form.responsible_user_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, responsible_user_id: value === "none" ? "" : value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem responsável</SelectItem>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>{profile.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_TASK_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea rows={4} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : initial ? "Salvar alterações" : "Criar tarefa"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
