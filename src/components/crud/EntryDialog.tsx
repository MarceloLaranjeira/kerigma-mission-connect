import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Entry, type EntryPayload, type EntryUpdate } from "@/hooks/useEntries";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Entry | null;
  onSubmit: (data: EntryPayload | EntryUpdate) => Promise<boolean>;
  title: string;
}

export function EntryDialog({ open, onOpenChange, initial, onSubmit, title }: Props) {
  const [form, setForm] = useState({
    title: "", subtitle: "", tag: "", meta: "",
    description: "", event_date: "", amount: "", status: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        title: initial?.title ?? "",
        subtitle: initial?.subtitle ?? "",
        tag: initial?.tag ?? "",
        meta: initial?.meta ?? "",
        description: initial?.description ?? "",
        event_date: initial?.event_date ?? "",
        amount: initial?.amount?.toString() ?? "",
        status: initial?.status ?? "",
      });
    }
  }, [open, initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const ok = await onSubmit({
      title: form.title.trim(),
      subtitle: form.subtitle || null,
      tag: form.tag || null,
      meta: form.meta || null,
      description: form.description || null,
      event_date: form.event_date || null,
      amount: form.amount ? parseFloat(form.amount) : null,
      status: form.status || null,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Preencha as informações do registro.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Título *</Label>
            <Input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          </div>
          <div>
            <Label>Subtítulo / Local / Responsável</Label>
            <Input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tag (status visual)</Label>
              <Input placeholder="Ativo, Programada…" value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})} />
            </div>
            <div>
              <Label>Info adicional</Label>
              <Input placeholder="Próx: 28/04, R$ 4.820…" value={form.meta} onChange={e=>setForm({...form,meta:e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data</Label>
              <Input type="date" value={form.event_date} onChange={e=>setForm({...form,event_date:e.target.value})} />
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
            </div>
          </div>
          <div>
            <Label>Descrição / Observações</Label>
            <Textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={()=>onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={busy} className="bg-gradient-primary text-white">
              {busy ? "Salvando…" : initial ? "Salvar alterações" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
