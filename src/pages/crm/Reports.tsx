import { useMemo } from "react";
import { BarChart3, DollarSign, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { Card } from "@/components/ui/card";
import { useCrmDashboard } from "@/hooks/use-crm";
import { formatCurrency } from "@/lib/crm";

export default function Reports() {
  const { loading, people, cards, tasks, campaigns, metrics, stages } = useCrmDashboard();
  const stageRows = useMemo(() => stages.map((stage) => ({ name: stage.name, total: cards.filter((card) => card.stage_id === stage.id).length })), [cards, stages]);

  return (
    <AppLayout greeting="Relatórios">
      <CrmHero
        eyebrow="Relatórios"
        title="Leituras rápidas para tomada de decisão da equipe."
        description="Os relatórios iniciais mostram panorama de pipeline, pessoas, campanhas, tarefas e saldo operacional."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <Users className="h-5 w-5 text-primary" />
          <p className="mt-3 text-3xl font-bold">{loading ? "..." : people.length}</p>
          <p className="text-sm text-muted-foreground">Pessoas cadastradas</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <BarChart3 className="h-5 w-5 text-primary" />
          <p className="mt-3 text-3xl font-bold">{loading ? "..." : tasks.filter((task) => task.status !== "concluida").length}</p>
          <p className="text-sm text-muted-foreground">Tarefas em aberto</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
          <DollarSign className="h-5 w-5 text-primary" />
          <p className="mt-3 text-3xl font-bold">{formatCurrency(metrics.monthIncome - metrics.monthExpense)}</p>
          <p className="text-sm text-muted-foreground">Saldo operacional recente</p>
        </Card>
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
            {campaigns.filter((campaign) => campaign.status === "ativa").length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma campanha ativa no momento.</p> : null}
            {campaigns.filter((campaign) => campaign.status === "ativa").map((campaign) => (
              <div key={campaign.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="font-medium">{campaign.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{campaign.front}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppLayout>
  );
}
