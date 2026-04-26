import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CRM_EVENT_TYPE_OPTIONS, CRM_FRONT_OPTIONS, formatDateInput } from "@/lib/crm";
import { type EventWithResponsible, type SimpleProfile } from "@/hooks/use-crm";
import { type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initial?: EventWithResponsible | null;
  profiles: SimpleProfile[];
  onSubmit: (payload: TablesInsert<"crm_events"> | TablesUpdate<"crm_events">) => Promise<boolean>;
}

export function EventFormDialog({ open, onOpenChange, initial, profiles, onSubmit }: EventFormDialogProps) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_type: "reuniao",
    front: "geral",
    starts_at: "",
    ends_at: "",
    location: "",
    responsible_user_id: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      event_type: initial?.event_type ?? "reuniao",
      front: initial?.front ?? "geral",
      starts_at: formatDateInput(initial?.starts_at),
      ends_at: formatDateInput(initial?.ends_at),
      location: initial?.location ?? "",
      responsible_user_id: initial?.responsible_user_id ?? "",
    });
  }, [initial, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      title: form.title.trim(),
      description: form.description || null,
      event_type: form.event_type as TablesInsert<"crm_events">["event_type"],
      front: form.front as TablesInsert<"crm_events">["front"],
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      location: form.location || null,
      responsible_user_id: form.responsible_user_id || null,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar evento" : "Novo evento"}</DialogTitle>
          <DialogDescription>Coordene visitas, viagens, treinamentos e ações missionárias no calendário.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Título</Label>
              <Input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.event_type} onValueChange={(value) => setForm((prev) => ({ ...prev, event_type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_EVENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Início</Label>
              <Input type="datetime-local" value={form.starts_at} onChange={(event) => setForm((prev) => ({ ...prev, starts_at: event.target.value }))} />
            </div>
            <div>
              <Label>Fim</Label>
              <Input type="datetime-local" value={form.ends_at} onChange={(event) => setForm((prev) => ({ ...prev, ends_at: event.target.value }))} />
            </div>
            <div>
              <Label>Frente</Label>
              <Select value={form.front} onValueChange={(value) => setForm((prev) => ({ ...prev, front: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_FRONT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
          </div>
          <div>
            <Label>Local</Label>
            <Input value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea rows={4} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : initial ? "Salvar alterações" : "Criar evento"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
