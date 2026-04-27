import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, BarChart3, Clock3, DollarSign, FileDown, Target, TrendingUp, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCrmDashboard } from "@/hooks/use-crm";
import { exportCSV, exportPDF } from "@/lib/exportData";
import { CRM_FRONT_OPTIONS, formatCurrency, frontLabel } from "@/lib/crm";

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, people, cards, tasks, campaigns, financial, stages } = useCrmDashboard();
  const [frontFilter, setFrontFilter] = useState(() => searchParams.get("front") || "todas");
  const personMap = useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);
  const campaignMap = useMemo(() => new Map(campaigns.map((campaign) => [campaign.id, campaign])), [campaigns]);
  const filteredPeople = useMemo(
    () => people.filter((person) => frontFilter === "todas" || person.front === frontFilter),
    [frontFilter, people],
  );
  const filteredCards = useMemo(
    () => cards.filter((card) => frontFilter === "todas" || personMap.get(card.person_id)?.front === frontFilter),
    [cards, frontFilter, personMap],
  );
  const filteredTasks = useMemo(
    () => tasks.filter((task) => frontFilter === "todas" || (task.person_id && personMap.get(task.person_id)?.front === frontFilter)),
    [frontFilter, personMap, tasks],
  );
  const filteredCampaigns = useMemo(
    () => campaigns.filter((campaign) => frontFilter === "todas" || campaign.front === frontFilter),
    [campaigns, frontFilter],
  );
  const filteredFinancial = useMemo(
    () => financial.filter((entry) => frontFilter === "todas" || (entry.campaign_id && campaignMap.get(entry.campaign_id)?.front === frontFilter)),
    [campaignMap, financial, frontFilter],
  );
  const stageRows = useMemo(() => stages.map((stage) => ({ name: stage.name, total: filteredCards.filter((card) => card.stage_id === stage.id).length })), [filteredCards, stages]);
  const saldo = filteredFinancial.reduce((sum, entry) => sum + (entry.type === "entrada" ? Number(entry.amount ?? 0) : -Number(entry.amount ?? 0)), 0);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const openTasks = filteredTasks.filter((task) => task.status === "aberta" || task.status === "em_andamento");
  const overdueTasks = openTasks.filter((task) => task.due_at && new Date(task.due_at) < now);
  const dueSoonTasks = openTasks.filter((task) => task.due_at && new Date(task.due_at) >= now && daysBetween(now, new Date(task.due_at)) <= 7);
  const overdueNextActions = filteredCards.filter((card) => card.next_action_at && new Date(card.next_action_at) < now);
  const urgentCards = filteredCards.filter((card) => card.priority === "urgente" || card.priority === "alta");
  const closedStageIds = new Set(stages.filter((stage) => stage.is_closed).map((stage) => stage.id));
  const closedCards = filteredCards.filter((card) => closedStageIds.has(card.stage_id)).length;
  const conversionRate = percentage(closedCards, filteredCards.length);
  const activeCampaigns = filteredCampaigns.filter((campaign) => campaign.status === "ativa");
  const campaignGoal = activeCampaigns.reduce((sum, campaign) => sum + Number(campaign.goal_amount ?? 0), 0);
  const income = filteredFinancial.filter((entry) => entry.type === "entrada").reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
  const expense = filteredFinancial.filter((entry) => entry.type === "saida").reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
  const financialDates = filteredFinancial.map((entry) => new Date(entry.entry_date)).sort((a, b) => a.getTime() - b.getTime());
  const financialWindowDays = financialDates.length > 1 ? Math.max(1, Math.ceil((financialDates.at(-1)!.getTime() - financialDates[0].getTime()) / dayMs)) : 30;
  const averageDailyBalance = saldo / financialWindowDays;
  const projectedBalance30 = saldo + averageDailyBalance * 30;
  const peopleLast30 = filteredPeople.filter((person) => daysBetween(new Date(person.created_at), now) <= 30).length;
  const peoplePrevious30 = filteredPeople.filter((person) => {
    const age = daysBetween(new Date(person.created_at), now);
    return age > 30 && age <= 60;
  }).length;
  const growthTrend = peoplePrevious30 === 0 ? peopleLast30 * 100 : Math.round(((peopleLast30 - peoplePrevious30) / peoplePrevious30) * 100);
  const riskScore = Math.min(100, Math.round(((overdueTasks.length * 2 + overdueNextActions.length * 2 + urgentCards.length) / Math.max(1, openTasks.length + filteredCards.length)) * 100));
  const actionCoverage = percentage(filteredCards.filter((card) => card.next_action_at).length, filteredCards.length);
  const indicativeKpis = [
    { label: "Pessoas cadastradas", value: filteredPeople.length.toString(), detail: `${filteredPeople.filter((person) => person.lifecycle_status === "discipulado").length} em discipulado`, icon: Users },
    { label: "Conversão do pipeline", value: `${conversionRate}%`, detail: `${closedCards} cards em etapa final`, icon: Target },
    { label: "Tarefas abertas", value: openTasks.length.toString(), detail: `${overdueTasks.length} vencidas e ${dueSoonTasks.length} vencem em 7 dias`, icon: Clock3 },
    { label: "Saldo operacional", value: formatCurrency(saldo), detail: `${formatCurrency(income)} entradas / ${formatCurrency(expense)} saídas`, icon: DollarSign },
  ];
  const predictiveKpis = [
    { label: "Risco operacional", value: `${riskScore}%`, detail: riskScore >= 50 ? "Atenção imediata a atrasos e prioridades." : "Risco sob controle pelos dados atuais.", icon: AlertTriangle, tone: riskScore >= 50 ? "text-destructive" : "text-primary" },
    { label: "Saldo em 30 dias", value: formatCurrency(projectedBalance30), detail: `Projeção baseada em média de ${formatCurrency(averageDailyBalance)} por dia.`, icon: TrendingUp, tone: projectedBalance30 < 0 ? "text-destructive" : "text-primary" },
    { label: "Tendência de crescimento", value: `${growthTrend >= 0 ? "+" : ""}${growthTrend}%`, detail: `${peopleLast30} novas pessoas nos últimos 30 dias.`, icon: TrendingUp, tone: growthTrend < 0 ? "text-destructive" : "text-primary" },
    { label: "Cobertura de próximos passos", value: `${actionCoverage}%`, detail: `${overdueNextActions.length} próximos passos vencidos.`, icon: Target, tone: actionCoverage < 70 ? "text-warning" : "text-primary" },
  ];
  const reportRows = useMemo(() => [
    { Indicador: "Frente", Total: frontFilter === "todas" ? "Todas" : frontLabel(frontFilter as typeof people[number]["front"]) },
    { Indicador: "Pessoas cadastradas", Total: filteredPeople.length },
    { Indicador: "Conversão do pipeline", Total: `${conversionRate}%` },
    { Indicador: "Tarefas em aberto", Total: openTasks.length },
    { Indicador: "Tarefas vencidas", Total: overdueTasks.length },
    { Indicador: "Campanhas ativas", Total: activeCampaigns.length },
    { Indicador: "Meta ativa somada", Total: formatCurrency(campaignGoal) },
    { Indicador: "Visitantes", Total: filteredPeople.filter((person) => person.lifecycle_status === "visitante").length },
    { Indicador: "Em discipulado", Total: filteredPeople.filter((person) => person.lifecycle_status === "discipulado").length },
    { Indicador: "Saldo operacional", Total: formatCurrency(saldo) },
    { Indicador: "Risco operacional previsto", Total: `${riskScore}%` },
    { Indicador: "Saldo previsto em 30 dias", Total: formatCurrency(projectedBalance30) },
    { Indicador: "Tendência de crescimento", Total: `${growthTrend >= 0 ? "+" : ""}${growthTrend}%` },
    { Indicador: "Cobertura de próximos passos", Total: `${actionCoverage}%` },
  ], [actionCoverage, activeCampaigns.length, campaignGoal, conversionRate, filteredPeople, frontFilter, growthTrend, openTasks.length, overdueTasks.length, projectedBalance30, riskScore, saldo]);
  const pipelineRows = useMemo(
    () => stageRows.map((row) => ({ Etapa: row.name, Total: row.total })),
    [stageRows],
  );
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
    <AppLayout greeting="Relatórios">
      <CrmHero
        eyebrow="Relatórios"
        title="Leituras rápidas para tomada de decisão da equipe."
        description="Os relatórios combinam KPIs indicativos, que mostram o estado atual, e KPIs preditivos, que antecipam riscos e tendências operacionais."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button className="bg-white text-primary hover:bg-white/90" onClick={() => exportCSV("kerygma-resumo-crm.csv", ["Indicador", "Total"], reportRows)}>
              <FileDown className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button variant="secondary" onClick={() => exportPDF("kerygma-pipeline-crm.pdf", "Pipeline CRM", ["Etapa", "Total"], pipelineRows, "Distribuição atual por etapa")}>
              <FileDown className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        }
      />

      <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
        <div className="max-w-xs">
          <Select value={frontFilter} onValueChange={(value) => { setFrontFilter(value); updateFrontUrl(value); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as frentes</SelectItem>
              {CRM_FRONT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">Indicativos</Badge>
          <p className="text-sm text-muted-foreground">Estado atual da operação.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {indicativeKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="border-border/60 bg-gradient-card p-5 shadow-card">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-3xl font-bold">{loading ? "..." : kpi.value}</p>
                <p className="text-sm font-medium">{kpi.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.detail}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">Preditivos</Badge>
          <p className="text-sm text-muted-foreground">Projeções simples calculadas a partir do histórico recente.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {predictiveKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="border-border/60 bg-gradient-card p-5 shadow-card">
                <Icon className={`h-5 w-5 ${kpi.tone}`} />
                <p className="mt-3 text-3xl font-bold">{loading ? "..." : kpi.value}</p>
                <p className="text-sm font-medium">{kpi.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.detail}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <h3 className="font-semibold">Pipeline por etapa</h3>
          <div className="mt-4 space-y-3">
            {stageRows.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 p-3">
                <span>{row.name}</span>
                <strong>{row.total}</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <h3 className="font-semibold">Campanhas ativas</h3>
          <div className="mt-4 space-y-3">
            {activeCampaigns.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma campanha ativa no momento.</p> : null}
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{campaign.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{frontLabel(campaign.front)}</p>
                  </div>
                  <Badge variant="outline">{formatCurrency(campaign.goal_amount)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppLayout>
  );
}

function percentage(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function daysBetween(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}
