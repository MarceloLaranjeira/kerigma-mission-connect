import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LucideIcon, Plus, Search, Pencil, Trash2, Loader2, ArrowLeft, FileDown } from "lucide-react";
import { Entry, EntryType, useEntries } from "@/hooks/useEntries";
import { EntryDialog } from "./EntryDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { exportCSV, exportPDF } from "@/lib/exportData";
import { formatCurrency, formatDate } from "@/lib/crm";

interface Props {
  type: EntryType;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  versiculo?: string;
  ctaLabel?: string;
  statsBuilder?: (items: Entry[]) => { label: string; value: string }[];
  fallbackStats?: { label: string; value: string }[];
}

export function CrudPage({ type, icon: Icon, title, subtitle, versiculo, ctaLabel = "Novo registro", statsBuilder, fallbackStats }: Props) {
  const { canEdit } = useAuth();
  const { items, loading, create, update, remove } = useEntries(type);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("todos");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [confirmDel, setConfirmDel] = useState<Entry | null>(null);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter((i) => {
      const matchesSearch = !q.trim() || [i.title, i.subtitle, i.tag, i.meta, i.description, i.status].join(" ").toLowerCase().includes(s);
      const normalizedTag = (i.tag ?? "").toLowerCase();
      const normalizedStatus = (i.status ?? "").toLowerCase();
      const matchesFilter =
        filter === "todos" ||
        (filter === "ativos" && (normalizedTag.includes("ativ") || normalizedStatus.includes("ativ"))) ||
        (filter === "programados" && (normalizedTag.includes("program") || normalizedStatus.includes("program"))) ||
        (filter === "com_data" && Boolean(i.event_date)) ||
        (filter === "com_valor" && Boolean(i.amount));
      return matchesSearch && matchesFilter;
    });
  }, [filter, items, q]);

  const exportRows = filtered.map((item) => ({
    Título: item.title,
    Subtítulo: item.subtitle ?? "",
    Tag: item.tag ?? "",
    Status: item.status ?? "",
    Data: item.event_date ? formatDate(item.event_date) : "",
    Valor: item.amount ? formatCurrency(item.amount) : "",
    Info: item.meta ?? "",
    Descrição: item.description ?? "",
  }));
  const exportColumns = ["Título", "Subtítulo", "Tag", "Status", "Data", "Valor", "Info", "Descrição"];

  const stats = statsBuilder
    ? statsBuilder(items)
    : fallbackStats ?? [
        { label: "Total", value: String(items.length) },
        { label: "Ativos", value: String(items.filter(i => (i.tag ?? "").toLowerCase().includes("ativ")).length) },
        { label: "Programados", value: String(items.filter(i => (i.tag ?? "").toLowerCase().includes("program")).length) },
        { label: "Com valor", value: String(items.filter(i => Boolean(i.amount)).length) },
      ];

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
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
              <Link to="/missoes"><ArrowLeft className="mr-2 h-4 w-4" /> Painel</Link>
            </Button>
            {canEdit && (
              <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-white text-primary hover:bg-white/90 shadow-elegant">
                <Plus className="h-4 w-4 mr-1" /> {ctaLabel}
              </Button>
            )}
          </div>
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por título, responsável, tag, status ou descrição..." className="pl-9 bg-background" value={q} onChange={(e)=>setQ(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full bg-background md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativos">Ativos</SelectItem>
              <SelectItem value="programados">Programados</SelectItem>
              <SelectItem value="com_data">Com data</SelectItem>
              <SelectItem value="com_valor">Com valor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportCSV(`${type}-${new Date().toISOString().slice(0, 10)}.csv`, exportColumns, exportRows)}>
            <FileDown className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={() => exportPDF(`${type}-${new Date().toISOString().slice(0, 10)}.pdf`, title, exportColumns, exportRows, `${filtered.length} registros`)}>
            <FileDown className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </Card>

      {/* List */}
      <Card className="bg-gradient-card border-border/60 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">Nenhum registro ainda.</p>
            {canEdit && (
              <Button className="mt-4 bg-gradient-primary text-white" onClick={()=>{ setEditing(null); setOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Criar o primeiro
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((it) => (
              <li key={it.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-smooth">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                  {it.title.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{it.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {it.subtitle ?? ""}
                    {it.event_date ? ` · ${formatDate(it.event_date)}` : ""}
                    {it.amount ? ` · ${formatCurrency(it.amount)}` : ""}
                  </p>
                </div>
                {it.tag && <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/15">{it.tag}</Badge>}
                {it.status && <Badge variant="outline">{it.status}</Badge>}
                {it.meta && <span className="text-xs text-muted-foreground hidden md:inline">{it.meta}</span>}
                {canEdit && (
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={()=>{ setEditing(it); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={()=>setConfirmDel(it)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <EntryDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        title={editing ? `Editar registro` : `${ctaLabel}`}
        onSubmit={async (data) => editing ? update(editing.id, data) : create(data)}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(v)=>!v && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDel?.title}" será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={async ()=>{ if(confirmDel){ await remove(confirmDel.id); setConfirmDel(null);} }}
            >Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
