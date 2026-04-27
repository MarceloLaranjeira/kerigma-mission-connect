import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  Flag,
  Globe2,
  HeartHandshake,
  Landmark,
  MapPin,
  Megaphone,
  UserPlus,
  Users,
  Waves,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { type Enums, type Tables } from "@/integrations/supabase/types";
import { useCrmDashboard } from "@/hooks/use-crm";
import { formatCurrency, formatDate } from "@/lib/crm";

type Entry = Tables<"entries">;
type EntryType = Enums<"entry_type">;

const missionAreas: Array<{
  type: EntryType;
  label: string;
  description: string;
  path: string;
  icon: typeof MapPin;
  crmFront?: Enums<"crm_front">;
  lifecycle?: Enums<"crm_lifecycle_status">;
}> = [
  { type: "locais", label: "Missões Locais", description: "Evangelização, discipulado e plantação em Manaus.", path: "/missoes/locais", icon: MapPin, crmFront: "locais" },
  { type: "ribeirinhas", label: "Ribeirinhas", description: "Viagens, bases e ações nas comunidades.", path: "/missoes/ribeirinhas", icon: Waves, crmFront: "ribeirinhas" },
  { type: "nacionais", label: "Nacionais", description: "Parcerias e projetos em território brasileiro.", path: "/missoes/nacionais", icon: Flag, crmFront: "nacionais" },
  { type: "mundiais", label: "Mundiais", description: "Sustento e cooperação internacional.", path: "/missoes/mundiais", icon: Globe2, crmFront: "mundiais" },
  { type: "projetos", label: "Projetos & Viagens", description: "Planejamento, logística e execução de campo.", path: "/missoes/projetos", icon: ClipboardList },
  { type: "missionarios", label: "Missionários", description: "Cadastro, sustento e acompanhamento de obreiros.", path: "/missoes/missionarios", icon: HeartHandshake, lifecycle: "missionario" },
  { type: "convertidos", label: "Convertidos", description: "Acompanhamento de decisões e integração.", path: "/missoes/convertidos", icon: UserPlus, lifecycle: "primeiro_contato" },
  { type: "visitantes", label: "Visitantes", description: "Registros vindos de cultos e eventos.", path: "/missoes/visitantes", icon: Users, lifecycle: "visitante" },
  { type: "discipulado", label: "Discipulado", description: "Turmas, módulos e acompanhamento espiritual.", path: "/missoes/discipulado", icon: BookOpen, crmFront: "discipulado", lifecycle: "discipulado" },
  { type: "treinamento", label: "Treinamento", description: "Capacitações e formação da equipe.", path: "/missoes/treinamento", icon: CalendarDays, crmFront: "treinamento" },
  { type: "campanhas", label: "Campanhas", description: "Mobilizações e ações missionárias.", path: "/missoes/campanhas", icon: Megaphone },
  { type: "tesouraria", label: "Tesouraria", description: "Lançamentos e apoio financeiro missionário.", path: "/missoes/tesouraria", icon: Landmark, crmFront: "tesouraria" },
  { type: "atas", label: "Atas", description: "Registros formais de reuniões e decisões.", path: "/missoes/atas", icon: FileText },
];

export default function MissoesDashboard() {
  const { people, campaigns, events, financial } = useCrmDashboard();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("entries").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Painel de missões carregado parcialmente.", error);
        setEntries([]);
      } else {
        setEntries((data ?? []) as Entry[]);
      }
      setLoading(false);
    };
    void load();
  }, []);

  const stats = useMemo(() => {
    const active = entries.filter((entry) => (entry.tag ?? "").toLowerCase().includes("ativ")).length;
    const scheduled = entries.filter((entry) => (entry.tag ?? "").toLowerCase().includes("program")).length;
    const amount = entries.reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
    return { total: entries.length, active, scheduled, amount };
  }, [entries]);
  const crmStats = useMemo(() => {
    const missionPeople = people.filter((person) => person.front !== "geral").length;
    const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ativa").length;
    const upcomingEvents = events.filter((event) => event.starts_at && new Date(event.starts_at) >= new Date()).length;
    const missionBalance = financial.reduce((sum, entry) => sum + (entry.type === "entrada" ? Number(entry.amount ?? 0) : -Number(entry.amount ?? 0)), 0);
    return { missionPeople, activeCampaigns, upcomingEvents, missionBalance };
  }, [campaigns, events, financial, people]);

  return (
    <AppLayout greeting="Missões">
      <CrmHero
        eyebrow="Kerygma Missões"
        title="As frentes missionárias continuam no centro da operação."
        description="O CRM organiza pessoas e acompanhamento; o painel de Missões preserva projetos, frentes, viagens, atas, campanhas e tesouraria ministerial."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Registros missionários</p>
          <p className="mt-2 text-2xl font-semibold">{loading ? "..." : stats.total}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Ativos</p>
          <p className="mt-2 text-2xl font-semibold">{stats.active}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Programados</p>
          <p className="mt-2 text-2xl font-semibold">{stats.scheduled}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Valores registrados</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(stats.amount)}</p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Pessoas no CRM missionário</p>
          <p className="mt-2 text-2xl font-semibold">{crmStats.missionPeople}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Campanhas CRM ativas</p>
          <p className="mt-2 text-2xl font-semibold">{crmStats.activeCampaigns}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Eventos CRM futuros</p>
          <p className="mt-2 text-2xl font-semibold">{crmStats.upcomingEvents}</p>
        </Card>
        <Card className="border-border/60 bg-gradient-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Saldo CRM vinculado</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(crmStats.missionBalance)}</p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {missionAreas.map((area) => {
          const Icon = area.icon;
          const total = entries.filter((entry) => entry.type === area.type).length;
          const crmPeople = people.filter((person) =>
            (area.crmFront ? person.front === area.crmFront : true) &&
            (area.lifecycle ? person.lifecycle_status === area.lifecycle : area.crmFront ? true : false),
          ).length;
          const peopleHref = area.crmFront
            ? `/pessoas?front=${area.crmFront}${area.lifecycle ? `&lifecycle=${area.lifecycle}` : ""}`
            : area.lifecycle
              ? `/pessoas?lifecycle=${area.lifecycle}`
              : null;
          const newPersonHref = peopleHref ? `${peopleHref}&novo=1` : null;
          return (
            <Card key={area.type} className="border-border/60 bg-gradient-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{area.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary">{total} registros</Badge>
                  {(area.crmFront || area.lifecycle) ? <Badge variant="outline">{crmPeople} pessoas CRM</Badge> : null}
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button asChild className="bg-gradient-primary text-white">
                  <Link to={area.path}>Abrir frente</Link>
                </Button>
                {peopleHref ? (
                  <Button asChild variant="outline">
                    <Link to={peopleHref}>Pessoas CRM</Link>
                  </Button>
                ) : null}
                {newPersonHref ? (
                  <Button asChild variant="outline">
                    <Link to={newPersonHref}><UserPlus className="mr-2 h-4 w-4" /> Nova pessoa</Link>
                  </Button>
                ) : null}
                {area.crmFront ? (
                  <>
                    <Button asChild variant="outline">
                      <Link to={`/agenda?front=${area.crmFront}&novo=1`}><CalendarDays className="mr-2 h-4 w-4" /> Novo evento</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/campanhas?front=${area.crmFront}&novo=1`}><Megaphone className="mr-2 h-4 w-4" /> Nova campanha</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/agenda?front=${area.crmFront}`}>Agenda CRM</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/pipeline?front=${area.crmFront}`}>Pipeline CRM</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/atividades?front=${area.crmFront}`}>Atividades CRM</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/tarefas?front=${area.crmFront}`}>Tarefas CRM</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/campanhas?front=${area.crmFront}`}>Campanhas CRM</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/financeiro?front=${area.crmFront}`}>Financeiro CRM</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/relatorios?front=${area.crmFront}`}>Relatórios CRM</Link>
                    </Button>
                  </>
                ) : null}
              </div>
            </Card>
          );
        })}
      </section>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
        <h3 className="font-semibold">Registros recentes</h3>
        <div className="mt-4 space-y-3">
          {entries.slice(0, 8).map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/70 p-3">
              <div>
                <p className="font-medium">{entry.title}</p>
                <p className="text-sm text-muted-foreground">{entry.subtitle || entry.description || "Sem descrição adicional."}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{missionAreas.find((area) => area.type === entry.type)?.label ?? entry.type}</Badge>
                <span>{entry.event_date ? formatDate(entry.event_date) : formatDate(entry.created_at)}</span>
              </div>
            </div>
          ))}
          {!loading && entries.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum registro missionário cadastrado ainda.</p> : null}
        </div>
      </Card>
    </AppLayout>
  );
}
