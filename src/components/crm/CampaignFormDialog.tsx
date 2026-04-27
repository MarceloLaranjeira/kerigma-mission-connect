import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CRM_CAMPAIGN_STATUS_OPTIONS, CRM_FRONT_OPTIONS, formatDateInput } from "@/lib/crm";
import { type CampaignWithOwner, type SimpleProfile } from "@/hooks/use-crm";
import { type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";

interface CampaignFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initial?: CampaignWithOwner | null;
  defaultFront?: TablesInsert<"crm_campaigns">["front"];
  profiles: SimpleProfile[];
  onSubmit: (payload: TablesInsert<"crm_campaigns"> | TablesUpdate<"crm_campaigns">) => Promise<boolean>;
}

export function CampaignFormDialog({ open, onOpenChange, initial, defaultFront, profiles, onSubmit }: CampaignFormDialogProps) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "rascunho",
    front: "geral",
    starts_at: "",
    ends_at: "",
    goal_amount: "",
    owner_user_id: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      status: initial?.status ?? "rascunho",
      front: initial?.front ?? defaultFront ?? "geral",
      starts_at: formatDateInput(initial?.starts_at),
      ends_at: formatDateInput(initial?.ends_at),
      goal_amount: initial?.goal_amount?.toString() ?? "",
      owner_user_id: initial?.owner_user_id ?? "",
    });
  }, [defaultFront, initial, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      title: form.title.trim(),
      description: form.description || null,
      status: form.status as TablesInsert<"crm_campaigns">["status"],
      front: form.front as TablesInsert<"crm_campaigns">["front"],
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      goal_amount: form.goal_amount ? Number(form.goal_amount) : null,
      owner_user_id: form.owner_user_id || null,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar campanha" : "Nova campanha"}</DialogTitle>
          <DialogDescription>Estruture ações missionárias com metas, período e responsáveis.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Título</Label>
              <Input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_CAMPAIGN_STATUS_OPTIONS.map((option) => (
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
              <Label>Meta financeira</Label>
              <Input type="number" step="0.01" value={form.goal_amount} onChange={(event) => setForm((prev) => ({ ...prev, goal_amount: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Responsável</Label>
              <Select value={form.owner_user_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, owner_user_id: value === "none" ? "" : value }))}>
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
            <Label>Descrição</Label>
            <Textarea rows={4} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : initial ? "Salvar alterações" : "Criar campanha"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
