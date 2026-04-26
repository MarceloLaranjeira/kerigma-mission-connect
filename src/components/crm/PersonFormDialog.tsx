import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CRM_FRONT_OPTIONS, CRM_LIFECYCLE_OPTIONS } from "@/lib/crm";
import { type CrmSource, type CrmStage, type PersonWithRelations, type SimpleProfile } from "@/hooks/use-crm";
import { type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initial?: PersonWithRelations | null;
  profiles: SimpleProfile[];
  stages: CrmStage[];
  sources: CrmSource[];
  onSubmit: (
    person: TablesInsert<"crm_people"> | TablesUpdate<"crm_people">,
    pipeline: Partial<TablesInsert<"crm_pipeline_cards"> | TablesUpdate<"crm_pipeline_cards">>,
  ) => Promise<boolean>;
}

export function PersonFormDialog({ open, onOpenChange, initial, profiles, stages, sources, onSubmit }: PersonFormDialogProps) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    preferred_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    neighborhood: "",
    city: "",
    state: "",
    front: "geral",
    lifecycle_status: "visitante",
    source_id: "",
    current_stage_id: "",
    assigned_user_id: "",
    notes: "",
    summary: "",
    next_action: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      full_name: initial?.full_name ?? "",
      preferred_name: initial?.preferred_name ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      whatsapp: initial?.whatsapp ?? "",
      neighborhood: initial?.neighborhood ?? "",
      city: initial?.city ?? "",
      state: initial?.state ?? "",
      front: initial?.front ?? "geral",
      lifecycle_status: initial?.lifecycle_status ?? "visitante",
      source_id: initial?.source_id ?? "",
      current_stage_id: initial?.current_stage_id ?? stages[0]?.id ?? "",
      assigned_user_id: initial?.assigned_user_id ?? "",
      notes: initial?.notes ?? "",
      summary: initial?.pipeline_card?.summary ?? "",
      next_action: initial?.pipeline_card?.next_action ?? "",
    });
  }, [initial, open, stages]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit(
      {
        full_name: form.full_name.trim(),
        preferred_name: form.preferred_name || null,
        email: form.email || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        neighborhood: form.neighborhood || null,
        city: form.city || null,
        state: form.state || null,
        front: form.front as TablesInsert<"crm_people">["front"],
        lifecycle_status: form.lifecycle_status as TablesInsert<"crm_people">["lifecycle_status"],
        source_id: form.source_id || null,
        current_stage_id: form.current_stage_id || null,
        assigned_user_id: form.assigned_user_id || null,
        notes: form.notes || null,
      },
      {
        stage_id: form.current_stage_id || null,
        assigned_user_id: form.assigned_user_id || null,
        summary: form.summary || null,
        next_action: form.next_action || null,
      },
    );
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar pessoa" : "Nova pessoa"}</DialogTitle>
          <DialogDescription>Cadastre e acompanhe o relacionamento pastoral em um único registro.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome completo</Label>
              <Input required value={form.full_name} onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))} />
            </div>
            <div>
              <Label>Nome preferido</Label>
              <Input value={form.preferred_name} onChange={(event) => setForm((prev) => ({ ...prev, preferred_name: event.target.value }))} />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(event) => setForm((prev) => ({ ...prev, whatsapp: event.target.value }))} />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input value={form.neighborhood} onChange={(event) => setForm((prev) => ({ ...prev, neighborhood: event.target.value }))} />
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
              <Label>Status do relacionamento</Label>
              <Select value={form.lifecycle_status} onValueChange={(value) => setForm((prev) => ({ ...prev, lifecycle_status: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_LIFECYCLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Origem</Label>
              <Select value={form.source_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, source_id: value === "none" ? "" : value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem origem</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Responsável</Label>
              <Select value={form.assigned_user_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, assigned_user_id: value === "none" ? "" : value }))}>
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
              <Label>Etapa no pipeline</Label>
              <Select value={form.current_stage_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, current_stage_id: value === "none" ? "" : value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem etapa</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cidade</Label>
              <Input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} />
            </div>
            <div>
              <Label>Estado</Label>
              <Input value={form.state} onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Resumo do card</Label>
              <Textarea rows={3} value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} />
            </div>
            <div>
              <Label>Próxima ação</Label>
              <Textarea rows={3} value={form.next_action} onChange={(event) => setForm((prev) => ({ ...prev, next_action: event.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea rows={4} value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>
              {busy ? "Salvando..." : initial ? "Salvar alterações" : "Cadastrar pessoa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
