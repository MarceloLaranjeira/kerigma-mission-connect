import { useMemo } from "react";
import { Activity, CalendarDays, CheckSquare, DollarSign, Flame, GitBranch, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCrmDashboard } from "@/hooks/use-crm";
import { formatCurrency, formatDate } from "@/lib/crm";

export default function Dashboard() {
  const { loading, metrics, stages, cards, tasks, interactions, events } = useCrmDashboard();

  const stageData = useMemo(
    () =>
      stages.map((stage) => ({
        name: stage.name,
        total: cards.filter((card) => card.stage_id === stage.id).length,
      })),
    [cards, stages],
  );

  const taskTrend = useMemo(
    () =>
      tasks.slice(0, 8).map((task, index) => ({
        name: `${index + 1}`,
        total: task.status === "concluida" ? 1 : 2,
      })),
    [tasks],
  );

  return (
    <AppLayout greeting="Dashboard CRM">
      <CrmHero
        eyebrow="Kerygma CRM"
        title="O centro operacional da igreja agora vive em um só painel."
        description="Acompanhe pessoas, pipeline, follow-up, tarefas, agenda, campanhas e financeiro com a mesma visão integrada do print de referência."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Visitantes em aberto" value={String(metrics.visitors)} icon={Users} tone="primary" />
        <KpiCard label="Em discipulado" value={String(metrics.peopleInDiscipleship)} icon={GitBranch} tone="accent" />
        <KpiCard label="Tarefas pendentes" value={String(metrics.upcomingTasks)} icon={CheckSquare} tone="warning" />
        <KpiCard label="Campanhas ativas" value={String(metrics.activeCampaigns)} icon={Flame} tone="success" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden border-0 bg-gradient-dark p-5 text-white shadow-elegant">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">Movimento operacional recente</p>
              <p className="mt-1 text-3xl font-bold">{loading ? "..." : metrics.upcomingTasks + metrics.peopleInDiscipleship}</p>
              <p className="mt-2 text-xs text-white/60">Tarefas abertas + pessoas em discipulado</p>
            </div>
            <Badge className="border-0 bg-white/10 text-white">Visão 12h</Badge>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taskTrend}>
                <defs>
                  <linearGradient id="crm-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" fill="url(#crm-area)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Composição do pipeline</h3>
              <p className="text-sm text-muted-foreground">Distribuição por etapa</p>
            </div>
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageData} dataKey="total" nameKey="name" innerRadius={50} outerRadius={86} paddingAngle={4}>
                  {stageData.map((stage, index) => (
                    <Cell key={stage.name} fill={["#2563eb", "#0ea5e9", "#f59e0b", "#14b8a6", "#22c55e", "#8b5cf6"][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {stageData.map((stage) => (
              <div key={stage.name} className="flex items-center justify-between text-sm">
                <span>{stage.name}</span>
                <strong>{stage.total}</strong>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Pipeline de acompanhamento</h3>
              <p className="text-sm text-muted-foreground">Resumo rápido das etapas ativas</p>
            </div>
            <Badge variant="secondary">{cards.length} cards</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => (
              <div key={stage.id} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{stage.name}</p>
                  <span className="text-sm text-muted-foreground">{cards.filter((card) => card.stage_id === stage.id).length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {cards
                    .filter((card) => card.stage_id === stage.id)
                    .slice(0, 3)
                    .map((card) => (
                      <div key={card.id} className="rounded-xl bg-secondary/70 p-3 text-sm text-muted-foreground">
                        {card.summary || "Próximo passo a definir"}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Atividades recentes</h3>
          </div>
          <div className="space-y-3">
            {interactions.slice(0, 6).map((interaction) => (
              <div key={interaction.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="text-sm font-medium">{interaction.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(interaction.happened_at, true)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Próximos eventos</h3>
          </div>
          <div className="space-y-3">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(event.starts_at, true)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success" />
            <h3 className="font-semibold">Entradas registradas</h3>
          </div>
          <p className="mt-3 text-3xl font-bold text-success">{formatCurrency(metrics.monthIncome)}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold">Saídas registradas</h3>
          </div>
          <p className="mt-3 text-3xl font-bold text-destructive">{formatCurrency(metrics.monthExpense)}</p>
        </Card>
      </section>
    </AppLayout>
  );
}
