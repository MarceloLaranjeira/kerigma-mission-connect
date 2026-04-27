import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Landmark, Plus, Scale, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { FinancialEntryDialog } from "@/components/crm/FinancialEntryDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmCampaigns, useCrmFinancial, useLookupMaps } from "@/hooks/use-crm";
import { CRM_FINANCIAL_TYPE_OPTIONS, CRM_FRONT_OPTIONS, formatCurrency, formatDate, frontLabel } from "@/lib/crm";

export default function Finance() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, create, remove } = useCrmFinancial();
  const { items: campaigns } = useCrmCampaigns();
  const { profiles, categories } = useLookupMaps();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [campaignFilter, setCampaignFilter] = useState("todas");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((entry) => {
      const matchesQuery = !term || [entry.description, entry.category?.name, entry.campaign?.title, entry.responsible_user?.full_name].join(" ").toLowerCase().includes(term);
      const matchesType = typeFilter === "todos" || entry.type === typeFilter;
      const matchesCampaign = campaignFilter === "todas" || (campaignFilter === "sem_campanha" ? !entry.campaign_id : entry.campaign_id === campaignFilter);
      const matchesFront = frontFilter === "todas" || entry.campaign?.front === frontFilter;
      return matchesQuery && matchesType && matchesCampaign && matchesFront;
    });
  }, [campaignFilter, frontFilter, items, query, typeFilter]);
  const totals = useMemo(() => {
    const entrada = filtered.filter((entry) => entry.type === "entrada").reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
    const saida = filtered.filter((entry) => entry.type === "saida").reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
    return { entrada, saida, saldo: entrada - saida };
  }, [filtered]);

  useEffect(() => {
    setFrontFilter(searchParams.get("front") || "todas");
  }, [searchParams]);

  const updateFrontUrl = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "todas") next.delete("front");
    else next.set("front", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <AppLayout greeting="Financeiro">
      <CrmHero
        eyebrow="Financeiro"
        title="Entradas e saídas ligadas à missão com visão clara de categoria e campanha."
        description="Os lançamentos financeiros deixam de ser notas soltas e passam a alimentar o painel operacional do CRM."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo lançamento</Button> : null}
      />

      <section className="grid gap-4 md:grid-cols-3">
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
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Saldo</h3>
          </div>
          <p className={`mt-3 text-3xl font-bold ${totals.saldo < 0 ? "text-destructive" : "text-success"}`}>{formatCurrency(totals.saldo)}</p>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_170px_200px_220px]">
          <Input placeholder="Buscar descrição, categoria, campanha ou responsável..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {CRM_FINANCIAL_TYPE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={frontFilter} onValueChange={(value) => { setFrontFilter(value); updateFrontUrl(value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as frentes</SelectItem>
              {CRM_FRONT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as campanhas</SelectItem>
              <SelectItem value="sem_campanha">Sem campanha</SelectItem>
              {campaigns.map((campaign) => <SelectItem key={campaign.id} value={campaign.id}>{campaign.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? <Card className="p-6">Carregando lançamentos...</Card> : null}
        {!loading && filtered.length === 0 ? <Card className="p-6 text-sm text-muted-foreground">Nenhum lançamento encontrado para os filtros atuais.</Card> : null}
        {filtered.map((entry) => (
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
                  {entry.campaign?.front ? <span>{frontLabel(entry.campaign.front)}</span> : null}
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
