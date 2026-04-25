import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Item { titulo: string; sub: string; tag?: string; meta?: string; }

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  versiculo?: string;
  stats: { label: string; value: string }[];
  items: Item[];
  ctaLabel?: string;
}

export function PagePlaceholder({ icon: Icon, title, subtitle, versiculo, stats, items, ctaLabel = "Novo registro" }: Props) {
  return (
    <AppLayout greeting={title}>
      {/* Hero */}
      <Card className="p-6 bg-gradient-hero text-white border-0 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/15 ring-1 ring-white/20 flex items-center justify-center backdrop-blur">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">Equipe de Missões IBK</p>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-white/80 max-w-2xl mt-1">{subtitle}</p>
              {versiculo && (
                <p className="text-xs italic text-white/70 mt-3 border-l-2 border-white/40 pl-3">{versiculo}</p>
              )}
            </div>
          </div>
          <Button className="bg-white text-primary hover:bg-white/90 shadow-elegant">
            <Plus className="h-4 w-4 mr-1" /> {ctaLabel}
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 bg-gradient-card border-border/60 shadow-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-gradient">{s.value}</p>
          </Card>
        ))}
      </section>

      {/* Toolbar */}
      <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9 bg-background" />
          </div>
          <Button variant="outline"><Filter className="h-4 w-4 mr-1" /> Filtros</Button>
        </div>
      </Card>

      {/* List */}
      <Card className="bg-gradient-card border-border/60 shadow-card overflow-hidden">
        <ul className="divide-y divide-border">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-smooth">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                {it.titulo.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{it.titulo}</p>
                <p className="text-sm text-muted-foreground truncate">{it.sub}</p>
              </div>
              {it.tag && <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/15">{it.tag}</Badge>}
              {it.meta && <span className="text-xs text-muted-foreground hidden md:inline">{it.meta}</span>}
              <Button size="sm" variant="ghost">Abrir →</Button>
            </li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  );
}
