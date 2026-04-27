import { type ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckSquare,
  DollarSign,
  GitBranch,
  Landmark,
  Plus,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCrmDashboard } from "@/hooks/use-crm";
import { formatCurrency, formatDate } from "@/lib/crm";

export default function Dashboard() {
  const { loading, metrics, stages, cards, tasks, interactions, events, campaigns } = useCrmDashboard();

  const stageRows = useMemo(
    () =>
      stages.map((stage) => ({
        id: stage.id,
        name: stage.name,
        total: cards.filter((card) => card.stage_id === stage.id).length,
      })),
    [cards, stages],
  );
  const openTasks = useMemo(
    () => tasks.filter((task) => task.status === "aberta" || task.status === "em_andamento").slice(0, 6),
    [tasks],
  );
  const nextActions = useMemo(
    () =>
      cards
        .filter((card) => card.next_action || card.next_action_at)
        .sort((a, b) => new Date(a.next_action_at ?? "2999-12-31").getTime() - new Date(b.next_action_at ?? "2999-12-31").getTime())
        .slice(0, 6),
    [cards],
  );
  const monthBalance = metrics.monthIncome - metrics.monthExpense;
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ativa").length;
  const criticalTotal = metrics.overdueTasks + metrics.nextActionsDue;

  return (
    <AppLayout greeting="Dashboard CRM">
      <section className="flex min-h-20 items-center justify-end">
        <Button asChild className="bg-white text-primary shadow-card hover:bg-white/90">
          <Link to="/pessoas?novo=1"><Plus className="mr-2 h-4 w-4" /> Nova pessoa</Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpi title="Visitantes em aberto" value={metrics.visitors} icon={Users} tone="primary" />
        <DashboardKpi title="Em discipulado" value={metrics.peopleInDiscipleship} icon={GitBranch} tone="primary" />
        <DashboardKpi title="Tarefas pendentes" value={metrics.upcomingTasks} icon={CheckSquare} tone="warning" />
        <DashboardKpi title="Atrasos críticos" value={criticalTotal} icon={AlertTriangle} tone="warning" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-success" />
            <h3 className="font-semibold">Entradas do mês</h3>
          </div>
          <p className="mt-6 text-4xl font-bold text-success">{formatCurrency(metrics.monthIncome)}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold">Saídas do mês</h3>
          </div>
          <p className="mt-6 text-4xl font-bold text-destructive">{formatCurrency(metrics.monthExpense)}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Saldo do mês</h3>
          </div>
          <p className={`mt-6 text-4xl font-bold ${monthBalance < 0 ? "text-destructive" : "text-success"}`}>{formatCurrency(monthBalance)}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Composição do pipeline</h3>
              <p className="text-sm text-muted-foreground">Distribuição atual por etapa</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/pipeline">Ver pipeline <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {stageRows.map((stage) => (
              <div key={stage.id} className="rounded-xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stage.name}</span>
                  <Badge variant="secondary">{stage.total}</Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent(stage.total, Math.max(1, cards.length))}%` }} />
                </div>
              </div>
            ))}
            {!loading && stageRows.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma etapa disponível.</p> : null}
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Resumo operacional</h3>
              <p className="text-sm text-muted-foreground">Indicadores de rotina</p>
            </div>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3">
            <SummaryLine label="Cards no pipeline" value={cards.length} />
            <SummaryLine label="Campanhas ativas" value={activeCampaigns} />
            <SummaryLine label="Eventos próximos" value={events.length} />
            <SummaryLine label="Atividades recentes" value={interactions.length} />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ListCard
          title="Próximas ações"
          icon={<Activity className="h-4 w-4 text-primary" />}
          empty="Nenhuma próxima ação definida."
          href="/pipeline"
          items={nextActions.map((card) => ({
            id: card.id,
            title: card.next_action || card.summary || "Ação sem descrição",
            subtitle: card.next_action_at ? formatDate(card.next_action_at, true) : "Sem prazo",
          }))}
        />
        <ListCard
          title="Tarefas abertas"
          icon={<CheckSquare className="h-4 w-4 text-primary" />}
          empty="Nenhuma tarefa aberta."
          href="/tarefas"
          items={openTasks.map((task) => ({
            id: task.id,
            title: task.title,
            subtitle: task.due_at ? formatDate(task.due_at, true) : "Sem prazo",
          }))}
        />
        <ListCard
          title="Próximos eventos"
          icon={<CalendarDays className="h-4 w-4 text-primary" />}
          empty="Nenhum evento próximo registrado."
          href="/agenda"
          items={events.slice(0, 6).map((event) => ({
            id: event.id,
            title: event.title,
            subtitle: event.starts_at ? formatDate(event.starts_at, true) : "Sem data",
          }))}
        />
      </section>
    </AppLayout>
  );
}

function DashboardKpi({ title, value, icon: Icon, tone }: { title: string; value: number; icon: LucideIcon; tone: "primary" | "warning" }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-bold">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone === "warning" ? "bg-warning/15 text-warning" : "bg-primary/10 text-primary"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function SummaryLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ListCard({ title, icon, items, empty, href }: { title: string; icon: ReactNode; items: Array<{ id: string; title: string; subtitle: string }>; empty: string; href: string }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to={href}>Ver <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? <p className="text-sm text-muted-foreground">{empty}</p> : null}
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function percent(value: number, total: number) {
  return Math.round((value / total) * 100);
}
