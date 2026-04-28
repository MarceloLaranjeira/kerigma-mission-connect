import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CRM_INTERACTION_TYPE_OPTIONS, formatDateInput } from "@/lib/crm";
import { type CrmPerson, type InteractionWithPerson, type SimpleProfile } from "@/hooks/use-crm";
import { type TablesInsert } from "@/integrations/supabase/types";

interface InteractionFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initial?: InteractionWithPerson | null;
  defaultPersonId?: string;
  defaultResponsibleUserId?: string | null;
  people: CrmPerson[];
  profiles: SimpleProfile[];
  onSubmit: (payload: TablesInsert<"crm_interactions">) => Promise<boolean>;
}

export function InteractionFormDialog({ open, onOpenChange, initial, defaultPersonId, defaultResponsibleUserId, people, profiles, onSubmit }: InteractionFormDialogProps) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    person_id: "",
    title: "",
    type: "nota",
    description: "",
    happened_at: "",
    responsible_user_id: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      person_id: initial?.person_id ?? defaultPersonId ?? people[0]?.id ?? "",
      title: initial?.title ?? "",
      type: initial?.type ?? "nota",
      description: initial?.description ?? "",
      happened_at: formatDateInput(initial?.happened_at) || new Date().toISOString().slice(0, 16),
      responsible_user_id: initial?.responsible_user_id ?? defaultResponsibleUserId ?? "",
    });
  }, [defaultPersonId, defaultResponsibleUserId, initial, open, people]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      person_id: form.person_id,
      title: form.title.trim(),
      type: form.type as TablesInsert<"crm_interactions">["type"],
      description: form.description || null,
      happened_at: form.happened_at ? new Date(form.happened_at).toISOString() : new Date().toISOString(),
      responsible_user_id: form.responsible_user_id || null,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar atividade" : "Nova atividade"}</DialogTitle>
          <DialogDescription>Registre visitas, ligações, orações e outros movimentos do cuidado pastoral.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Pessoa</Label>
              <Select value={form.person_id} onValueChange={(value) => setForm((prev) => ({ ...prev, person_id: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>{person.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_INTERACTION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título</Label>
              <Input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
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
          </div>
          <div>
            <Label>Data e hora</Label>
            <Input type="datetime-local" value={form.happened_at} onChange={(event) => setForm((prev) => ({ ...prev, happened_at: event.target.value }))} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea rows={4} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : initial ? "Salvar alterações" : "Registrar atividade"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
