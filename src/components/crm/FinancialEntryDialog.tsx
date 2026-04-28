import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CRM_FINANCIAL_TYPE_OPTIONS } from "@/lib/crm";
import { type CampaignWithOwner, type CrmFinancialCategory, type FinancialEntryWithRelations, type SimpleProfile } from "@/hooks/use-crm";
import { type TablesInsert } from "@/integrations/supabase/types";

interface FinancialEntryDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initial?: FinancialEntryWithRelations | null;
  categories: CrmFinancialCategory[];
  campaigns: CampaignWithOwner[];
  profiles: SimpleProfile[];
  onSubmit: (payload: TablesInsert<"crm_financial_entries">) => Promise<boolean>;
}

export function FinancialEntryDialog({ open, onOpenChange, initial, categories, campaigns, profiles, onSubmit }: FinancialEntryDialogProps) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    type: "entrada",
    category_id: "",
    campaign_id: "",
    responsible_user_id: "",
    amount: "",
    entry_date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      type: initial?.type ?? "entrada",
      category_id: initial?.category_id ?? categories[0]?.id ?? "",
      campaign_id: initial?.campaign_id ?? "",
      responsible_user_id: initial?.responsible_user_id ?? "",
      amount: initial?.amount != null ? String(initial.amount) : "",
      entry_date: initial?.entry_date ?? new Date().toISOString().slice(0, 10),
      description: initial?.description ?? "",
    });
  }, [categories, initial, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      type: form.type as TablesInsert<"crm_financial_entries">["type"],
      category_id: form.category_id || null,
      campaign_id: form.campaign_id || null,
      responsible_user_id: form.responsible_user_id || null,
      amount: Number(form.amount || 0),
      entry_date: form.entry_date,
      description: form.description || null,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar lançamento" : "Novo lançamento"}</DialogTitle>
          <DialogDescription>Registre entradas e saídas ligadas à operação ou às campanhas.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_FINANCIAL_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor</Label>
              <Input required type="number" step="0.01" value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))} />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={form.category_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, category_id: value === "none" ? "" : value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input type="date" value={form.entry_date} onChange={(event) => setForm((prev) => ({ ...prev, entry_date: event.target.value }))} />
            </div>
            <div>
              <Label>Campanha</Label>
              <Select value={form.campaign_id || "none"} onValueChange={(value) => setForm((prev) => ({ ...prev, campaign_id: value === "none" ? "" : value }))}>
                <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem campanha</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>{campaign.title}</SelectItem>
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
            <Label>Descrição</Label>
            <Textarea rows={4} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : initial ? "Salvar alterações" : "Registrar lançamento"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
