import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles, HeartHandshake, Globe2, Waves, Users, Coins,
  CheckCircle2, Phone, Mail, Calendar as CalIcon, MapPin, Bot, Send
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";

const monthlyData = [
  { m: "Jan", almas: 24, contrib: 8200 },
  { m: "Fev", almas: 31, contrib: 9100 },
  { m: "Mar", almas: 58, contrib: 14200 },
  { m: "Abr", almas: 42, contrib: 11800 },
  { m: "Mai", almas: 47, contrib: 12400 },
  { m: "Jun", almas: 73, contrib: 18900 },
  { m: "Jul", almas: 61, contrib: 15600 },
  { m: "Ago", almas: 55, contrib: 14800 },
  { m: "Set", almas: 88, contrib: 22300 },
  { m: "Out", almas: 67, contrib: 17100 },
  { m: "Nov", almas: 79, contrib: 19400 },
  { m: "Dez", almas: 92, contrib: 24500 },
];

const pipeline = [
  { fase: "Visitante", cor: "bg-slate-500", qtd: 42, total: "—" },
  { fase: "Decisão", cor: "bg-primary", qtd: 28, total: "Mateus 28" },
  { fase: "Acompanhamento", cor: "bg-accent", qtd: 19, total: "EBK + GC" },
  { fase: "Discipulado", cor: "bg-warning", qtd: 14, total: "Em curso" },
  { fase: "Membro Batizado", cor: "bg-success", qtd: 23, total: "Confirmados" },
];

const itens = [
  { nome: "Família Souza", local: "Compensa", valor: "1ª visita", tempo: "2h" },
  { nome: "João Pedro Lima", local: "EBK Adultos", valor: "Discipulado", tempo: "5h" },
  { nome: "Maria Clara", local: "Comunidade São José", valor: "Ribeirinha", tempo: "Hoje" },
  { nome: "Carlos & Renata", local: "GC Centro", valor: "Acompanhamento", tempo: "1d" },
];

const tarefas = [
  { t: "Ligação para Família Souza (recém-convertida)", h: "08:30", ok: false },
  { t: "Reunião com Pr Daniel — planejamento ribeirinho", h: "10:00", ok: true },
  { t: "Enviar materiais para campo Tefé", h: "13:00", ok: true },
  { t: "Treinamento de evangelismo — equipe local", h: "16:30", ok: false },
  { t: "Fechamento financeiro Mês de Missões Locais", h: "18:00", ok: false },
];

const atividades = [
  { tipo: "convertido", txt: "Novo convertido cadastrado: Lucas Andrade", autor: "Sara (Secretária)", h: "Hoje, 10:30", icon: Sparkles },
  { tipo: "viagem", txt: "Viagem ribeirinha agendada — Comunidade Boa Esperança", autor: "Pr Marcos", h: "Hoje, 09:15", icon: Waves },
  { tipo: "campanha", txt: "Campanha 'Mês de Missões Mundiais' iniciada", autor: "Pr Roberto", h: "Ontem, 16:45", icon: Globe2 },
  { tipo: "oferta", txt: "Oferta missionária registrada — R$ 4.820", autor: "Tesouraria", h: "Ontem, 14:20", icon: Coins },
  { tipo: "discipulado", txt: "Família Oliveira concluiu módulo 1 da EBK", autor: "Coord. Locais", h: "Ontem, 11:30", icon: CheckCircle2 },
];

const convertidos = [
  { n: "Lucas Andrade", o: "Culto Domingo Manhã", st: "Acompanhar", h: "10:30", ini: "LA" },
  { n: "Família Souza (4)", o: "Evangelismo Compensa", st: "Visitar", h: "09:15", ini: "FS" },
  { n: "Marina Castro", o: "Missão Boa Esperança", st: "EBK", h: "Ontem", ini: "MC" },
  { n: "Pedro & Ana", o: "GC Centro", st: "Discipulado", h: "Ontem", ini: "PA" },
];

const composicao = [
  { name: "Locais", value: 45, color: "hsl(var(--primary))" },
  { name: "Ribeirinhas", value: 25, color: "hsl(var(--accent))" },
  { name: "Nacionais", value: 18, color: "hsl(var(--warning))" },
  { name: "Mundiais", value: 12, color: "hsl(var(--success))" },
];

export default function Index() {
  return (
    <AppLayout>
      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Almas Alcançadas (ano)" value="717" delta="+18,7%" icon={Sparkles} tone="primary" />
        <KpiCard label="Novos Convertidos (mês)" value="92" delta="+24,5%" icon={HeartHandshake} tone="accent" />
        <KpiCard label="Missionários Ativos" value="38" delta="+8,2%" icon={Users} tone="success" />
        <KpiCard label="Ofertas Missionárias" value="R$ 24.500" delta="+11,3%" icon={Coins} tone="warning" />
      </section>

      {/* Pipeline de Discipulado */}
      <Card className="p-5 bg-gradient-card border-border/60 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Pipeline de Discipulado</h2>
            <p className="text-sm text-muted-foreground">Da primeira visita ao batismo — Cultura Kerygma</p>
          </div>
          <Button variant="outline" size="sm">Ver todos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipeline.map((p) => (
            <div key={p.fase} className="rounded-xl border border-border bg-background/60 overflow-hidden">
              <div className={`${p.cor} text-white px-3 py-2 flex items-center gap-2`}>
                <span className="h-2 w-2 rounded-full bg-white/80" />
                <span className="text-sm font-semibold">{p.fase}</span>
              </div>
              <div className="p-3">
                <p className="text-2xl font-bold">{p.qtd}</p>
                <p className="text-xs text-muted-foreground">{p.total}</p>
                <div className="mt-3 space-y-2">
                  {itens.slice(0, 2).map((it, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-secondary/60">
                      <p className="font-medium truncate">{it.nome}</p>
                      <p className="text-muted-foreground truncate">{it.local} · {it.tempo}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs text-primary font-medium hover:underline">+ ver mais</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Gráfico + Composição + Lead Scoring */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5 bg-gradient-dark text-white border-0 shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-white/60">Almas Alcançadas (Últimos 12 meses)</p>
                <p className="text-3xl font-bold mt-1">717 <span className="text-success text-sm font-semibold ml-2">↑ 18,7% vs ano anterior</span></p>
              </div>
              <div className="text-xs px-3 py-1.5 rounded-md bg-white/10">12 meses ▾</div>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--sidebar-background))", border: "1px solid hsl(var(--sidebar-border))", borderRadius: 12, color: "white" }}
                  />
                  <Area type="monotone" dataKey="almas" stroke="hsl(var(--primary-glow))" strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-card border-border/60 shadow-card">
          <h3 className="font-semibold">Composição das Frentes</h3>
          <p className="text-xs text-muted-foreground">Distribuição de esforço missionário</p>
          <div className="h-44 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={composicao} dataKey="value" innerRadius={42} outerRadius={70} paddingAngle={3}>
                  {composicao.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {composicao.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Atividades + Tarefas + IA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-card border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Atividades Recentes</h3>
            <Button variant="link" size="sm" className="text-primary">Ver todas</Button>
          </div>
          <ul className="space-y-3">
            {atividades.map((a, i) => (
              <li key={i} className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{a.txt}</p>
                  <p className="text-xs text-muted-foreground">{a.autor} · {a.h}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-gradient-card border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Tarefas do Dia</h3>
            <Badge variant="secondary">{tarefas.filter(t => !t.ok).length} pendentes</Badge>
          </div>
          <ul className="space-y-2">
            {tarefas.map((t, i) => (
              <li key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${t.ok ? "bg-success/5" : "bg-secondary/60"}`}>
                <CheckCircle2 className={`h-4 w-4 ${t.ok ? "text-success" : "text-muted-foreground"}`} />
                <p className={`flex-1 text-sm ${t.ok ? "line-through text-muted-foreground" : ""}`}>{t.t}</p>
                <span className="text-xs font-mono text-muted-foreground">{t.h}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-gradient-hero text-white border-0 shadow-elegant relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Assistente Kerygma</h3>
            </div>
            <p className="text-sm text-white/80">Olá! Posso ajudar a planejar campanhas, sugerir versículos para discipulado e organizar viagens missionárias.</p>
            <div className="mt-4 space-y-2">
              {["Quais convertidos precisam de visita?", "Sugerir tema para próximo culto", "Resumo financeiro do mês"].map((q) => (
                <button key={q} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-smooth">
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-lg px-3">
              <input className="flex-1 bg-transparent py-2 text-sm placeholder:text-white/50 outline-none" placeholder="Digite sua pergunta..." />
              <Send className="h-4 w-4" />
            </div>
          </div>
        </Card>
      </section>

      {/* Convertidos + Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-gradient-card border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Novos Convertidos — Acompanhamento</h3>
              <p className="text-xs text-muted-foreground">Identifique, anote os dados e acompanhe a volta à Igreja</p>
            </div>
            <Button size="sm" variant="outline">+ Cadastrar</Button>
          </div>
          <ul className="divide-y divide-border">
            {convertidos.map((c) => (
              <li key={c.n} className="flex items-center gap-3 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">{c.ini}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{c.n}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.o}</p>
                </div>
                <Badge className="bg-accent/15 text-accent border-0 hover:bg-accent/20">{c.st}</Badge>
                <div className="flex items-center gap-1 ml-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-gradient-dark text-white border-0 shadow-elegant">
          <h3 className="font-semibold">Próximos Eventos & Viagens</h3>
          <p className="text-xs text-white/60">Agenda missionária da Igreja Batista Kerygma</p>
          <ol className="mt-4 space-y-4 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-white/15">
            {[
              { d: "26 ABR", t: "Culto de Envio — Equipe Tefé", l: "IBK Central · 19h", ic: Waves, c: "bg-accent" },
              { d: "03 MAI", t: "Treinamento de Evangelismo (Cap. VII)", l: "Salão Anexo · 14h", ic: Users, c: "bg-primary" },
              { d: "10 MAI", t: "Campanha 'Mês de Missões Mundiais'", l: "Toda a Igreja", ic: Globe2, c: "bg-warning" },
              { d: "17 MAI", t: "Viagem Ribeirinha — Boa Esperança", l: "Rio Negro · 5 dias", ic: MapPin, c: "bg-success" },
              { d: "24 MAI", t: "Assembleia da Equipe de Missões", l: "IBK Central · 16h", ic: CalIcon, c: "bg-primary-glow" },
            ].map((e, i) => (
              <li key={i} className="flex items-start gap-4 relative">
                <div className={`h-8 w-8 rounded-full ${e.c} flex items-center justify-center shrink-0 z-10 ring-4 ring-sidebar-background`}>
                  <e.ic className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-semibold">{e.t}</p>
                  <p className="text-xs text-white/60">{e.l}</p>
                </div>
                <span className="text-[11px] font-bold tracking-wider text-white/80 bg-white/10 px-2 py-1 rounded">{e.d}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </AppLayout>
  );
}
