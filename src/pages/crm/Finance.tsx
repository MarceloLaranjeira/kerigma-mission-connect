import { useMemo, useState } from "react";
import { Landmark, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { FinancialEntryDialog } from "@/components/crm/FinancialEntryDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmCampaigns, useCrmFinancial, useLookupMaps } from "@/hooks/use-crm";
import { formatCurrency, formatDate } from "@/lib/crm";

export default function Finance() {
  const { canEdit } = useAuth();
  const { items, loading, create, remove } = useCrmFinancial();
  const { items: campaigns } = useCrmCampaigns();
  const { profiles, categories } = useLookupMaps();
  const [open, setOpen] = useState(false);

  const totals = useMemo(() => ({
    entrada: items.filter((entry) => entry.type === "entrada").reduce((sum, entry) => sum + entry.amount, 0),
    saida: items.filter((entry) => entry.type === "saida").reduce((sum, entry) => sum + entry.amount, 0),
  }), [items]);

  return (
    <AppLayout greeting="Financeiro">
      <CrmHero
        eyebrow="Financeiro"
        title="Entradas e saídas ligadas à missão com visão clara de categoria e campanha."
        description="Os lançamentos financeiros deixam de ser notas soltas e passam a alimentar o painel operacional do CRM."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo lançamento</Button> : null}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-success" />
            <h3 className="font-semibold">Entradas</h3>
          </div>
          <p className="mt-3 text-3xl font-bold text-success">{formatCurrency(totals.entrada)}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold">Saídas</h3>
          </div>
          <p className="mt-3 text-3xl font-bold text-destructive">{formatCurrency(totals.saida)}</p>
        </Card>
      </section>

      <div className="space-y-4">
        {loading ? <Card className="p-6">Carregando lançamentos...</Card> : null}
        {items.map((entry) => (
          <Card key={entry.id} className="border-border/60 bg-gradient-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{formatCurrency(entry.amount)}</h3>
                  <Badge variant="secondary">{entry.type}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{entry.description || "Sem descrição adicional."}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{entry.category?.name || "Sem categoria"}</span>
                  <span>{entry.campaign?.title || "Sem campanha"}</span>
                  <span>{entry.responsible_user?.full_name || "Sem responsável"}</span>
                  <span>{formatDate(entry.entry_date)}</span>
                </div>
              </div>
              {canEdit ? <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(entry.id)}><Trash2 className="h-4 w-4" /></Button> : null}
            </div>
          </Card>
        ))}
      </div>

      <FinancialEntryDialog open={open} onOpenChange={setOpen} categories={categories} campaigns={campaigns} profiles={profiles} onSubmit={create} />
    </AppLayout>
  );
}
