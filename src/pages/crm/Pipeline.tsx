import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Edit, GitBranch } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmPipeline, nextStageId, type CrmPipelineCard } from "@/hooks/use-crm";
import { CRM_PRIORITY_OPTIONS, formatDate, initials, priorityTone } from "@/lib/crm";

export default function Pipeline() {
  const { canEdit } = useAuth();
  const { stages, cards, loading, moveCard, updateCard } = useCrmPipeline();
  const [editing, setEditing] = useState<(CrmPipelineCard & { person: { full_name: string } | null }) | null>(null);
  const grouped = useMemo(
    () => stages.map((stage) => ({ ...stage, cards: cards.filter((card) => card.stage_id === stage.id) })),
    [cards, stages],
  );

  return (
    <AppLayout greeting="Pipeline">
      <CrmHero
        eyebrow="Pipeline"
        title="O funil de relacionamento da igreja com visual de operação real."
        description="Mova pessoas entre etapas, identifique gargalos e defina o próximo passo sem sair do quadro."
      />

      {loading ? <Card className="p-6">Carregando pipeline...</Card> : null}

      <section className="grid gap-4 xl:grid-cols-3">
        {grouped.map((stage) => (
          <Card key={stage.id} className="border-border/60 bg-gradient-card p-4 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{stage.name}</h3>
                <p className="text-sm text-muted-foreground">{stage.cards.length} pessoas</p>
              </div>
              <GitBranch className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3">
              {stage.cards.length === 0 ? <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">Sem cards nesta etapa.</p> : null}
              {stage.cards.map((card) => (
                <div key={card.id} className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-white">{initials(card.person?.full_name ?? "CRM")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{card.person?.full_name || "Pessoa sem nome"}</p>
                        <p className={`text-xs font-medium ${priorityTone(card.priority)}`}>Prioridade {card.priority}</p>
                      </div>
                    </div>
                    {canEdit ? <Button size="icon" variant="ghost" onClick={() => setEditing(card)}><Edit className="h-4 w-4" /></Button> : null}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{card.summary || "Resumo ainda não definido."}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant="secondary">{card.next_action_at ? formatDate(card.next_action_at) : "Sem data"}</Badge>
                    {canEdit ? (
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" disabled={!nextStageId(stages, card.stage_id, "prev")} onClick={() => {
                          const target = nextStageId(stages, card.stage_id, "prev");
                          if (target) void moveCard(card, target);
                        }}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" disabled={!nextStageId(stages, card.stage_id, "next")} onClick={() => {
                          const target = nextStageId(stages, card.stage_id, "next");
                          if (target) void moveCard(card, target);
                        }}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <PipelineCardDialog open={!!editing} onOpenChange={(value) => !value && setEditing(null)} card={editing} stages={stages} onSubmit={async (payload) => editing ? updateCard(editing.id, payload) : false} />
    </AppLayout>
  );
}

function PipelineCardDialog({
  open,
  onOpenChange,
  card,
  stages,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  card: (CrmPipelineCard & { person: { full_name: string } | null }) | null;
  stages: { id: string; name: string }[];
  onSubmit: (payload: Partial<CrmPipelineCard>) => Promise<boolean>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ summary: "", next_action: "", next_action_at: "", priority: "media", stage_id: "" });

  useEffect(() => {
    if (!card) return;
    setForm({
      summary: card.summary ?? "",
      next_action: card.next_action ?? "",
      next_action_at: card.next_action_at ? new Date(card.next_action_at).toISOString().slice(0, 16) : "",
      priority: card.priority,
      stage_id: card.stage_id,
    });
  }, [card]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      summary: form.summary || null,
      next_action: form.next_action || null,
      next_action_at: form.next_action_at ? new Date(form.next_action_at).toISOString() : null,
      priority: form.priority as CrmPipelineCard["priority"],
      stage_id: form.stage_id,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar card</DialogTitle>
          <DialogDescription>{card?.person?.full_name}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Etapa</Label>
            <Select value={form.stage_id} onValueChange={(value) => setForm((prev) => ({ ...prev, stage_id: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map((stage) => <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Select value={form.priority} onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CRM_PRIORITY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Resumo</Label>
            <Textarea rows={3} value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} />
          </div>
          <div>
            <Label>Próxima ação</Label>
            <Textarea rows={3} value={form.next_action} onChange={(event) => setForm((prev) => ({ ...prev, next_action: event.target.value }))} />
          </div>
          <div>
            <Label>Data da próxima ação</Label>
            <Input type="datetime-local" value={form.next_action_at} onChange={(event) => setForm((prev) => ({ ...prev, next_action_at: event.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary text-white" disabled={busy}>{busy ? "Salvando..." : "Salvar card"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
