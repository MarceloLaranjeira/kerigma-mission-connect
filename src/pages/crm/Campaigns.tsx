import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Edit, Flame, Plus, Target, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { CampaignFormDialog } from "@/components/crm/CampaignFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmCampaigns, useLookupMaps, type CampaignWithOwner } from "@/hooks/use-crm";
import { CRM_CAMPAIGN_STATUS_OPTIONS, CRM_FRONT_OPTIONS, formatCurrency, formatDate, frontLabel } from "@/lib/crm";
import { type TablesInsert } from "@/integrations/supabase/types";

export default function Campaigns() {
  const { canEdit } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, create, update, remove } = useCrmCampaigns();
  const { profiles } = useLookupMaps();
  const [editing, setEditing] = useState<CampaignWithOwner | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ativas");
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((campaign) => {
      const matchesQuery = !term || [campaign.title, campaign.description, campaign.owner_user?.full_name].join(" ").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "todas" || (statusFilter === "ativas" ? campaign.status === "ativa" : campaign.status === statusFilter);
      const matchesFront = frontFilter === "todas" || campaign.front === frontFilter;
      return matchesQuery && matchesStatus && matchesFront;
    });
  }, [frontFilter, items, query, statusFilter]);
  const active = items.filter((campaign) => campaign.status === "ativa").length;
  const planned = items.filter((campaign) => campaign.status === "rascunho" || campaign.status === "pausada").length;
  const goalTotal = items.reduce((sum, campaign) => sum + Number(campaign.goal_amount ?? 0), 0);
  const selectedFront = frontFilter === "todas" ? undefined : frontFilter as TablesInsert<"crm_campaigns">["front"];

  useEffect(() => {
    setFrontFilter(searchParams.get("front") || "todas");
    if (canEdit && searchParams.get("novo") === "1") {
      setEditing(null);
      setOpen(true);
    }
  }, [canEdit, searchParams]);

  const handleCampaignOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && searchParams.get("novo") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("novo");
      setSearchParams(next, { replace: true });
    }
  };

  const updateFrontUrl = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "todas") next.delete("front");
    else next.set("front", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <AppLayout greeting="Campanhas">
      <CrmHero
        eyebrow="Campanhas"
        title="Ações missionárias com meta, frente, período e liderança claros."
        description="As campanhas conectam pessoas, eventos e orçamento sem virar registros soltos pelo sistema."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nova campanha</Button> : null}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Campanhas ativas</p>
          <p className="mt-2 text-2xl font-semibold">{active}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Planejamento</p>
          <p className="mt-2 text-2xl font-semibold">{planned}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Metas somadas</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(goalTotal)}</p>
        </Card>
      </section>

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <Input placeholder="Buscar campanha ou responsável..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativas">Ativas</SelectItem>
              <SelectItem value="todas">Todas</SelectItem>
              {CRM_CAMPAIGN_STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={frontFilter} onValueChange={(value) => { setFrontFilter(value); updateFrontUrl(value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as frentes</SelectItem>
              {CRM_FRONT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {loading ? <Card className="p-6">Carregando campanhas...</Card> : null}
        {!loading && filtered.length === 0 ? <Card className="p-6 text-sm text-muted-foreground">Nenhuma campanha encontrada para os filtros atuais.</Card> : null}
        {filtered.map((campaign) => (
          <Card key={campaign.id} className="border-border/60 bg-gradient-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{campaign.title}</h3>
                  <Badge variant="secondary">{campaign.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{campaign.description || "Sem descrição adicional."}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{frontLabel(campaign.front)}</span>
                  <span>{campaign.starts_at ? formatDate(campaign.starts_at) : "Sem início"}</span>
                  <span>{campaign.owner_user?.full_name || "Sem responsável"}</span>
                  <span className="inline-flex items-center gap-1"><Target className="h-3 w-3" /> {formatCurrency(campaign.goal_amount)}</span>
                </div>
              </div>
              {canEdit ? (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(campaign); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(campaign.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <CampaignFormDialog open={open} onOpenChange={handleCampaignOpenChange} initial={editing} defaultFront={selectedFront} profiles={profiles} onSubmit={async (payload) => editing ? update(editing.id, payload) : create(payload)} />
    </AppLayout>
  );
}
