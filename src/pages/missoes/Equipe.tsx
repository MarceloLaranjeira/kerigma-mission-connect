import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { type Enums, type Tables, type TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { showError } from "@/lib/errors";
import { getAvatarUrls } from "@/lib/avatarCache";
import { Users, Search, Check, X, Loader2, ShieldCheck, Download, FileText, ChevronLeft, ChevronRight, UserCog } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportCSV, exportPDF } from "@/lib/exportData";
import { logAccess, logIfDenied } from "@/lib/accessLog";

type Status = Enums<"member_status">;
type Role = Enums<"app_role">;
type MinistryArea = Enums<"ministry_area">;
type ProfileRow = Pick<Tables<"profiles">, "id" | "full_name" | "email" | "avatar_url" | "status" | "ministry_role" | "ministry_area" | "phone">;
type RoleRow = Pick<Tables<"user_roles">, "user_id" | "role">;

interface Member {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  status: Status;
  ministry_role: string | null;
  ministry_area: MinistryArea | null;
  phone: string | null;
  roles: Role[];
}

const ROLE_LABEL: Record<Role,string> = {
  admin: "Admin", coordenador: "Coordenador", editor: "Editor", voluntario: "Voluntário",
};
const AREA_LABEL: Record<MinistryArea,string> = {
  geral: "Geral",
  locais: "Missões Locais",
  ribeirinhas: "Ribeirinhas",
  nacionais: "Nacionais",
  mundiais: "Mundiais",
  discipulado: "Discipulado",
  treinamento: "Treinamento",
  tesouraria: "Tesouraria",
};
const AREA_OPTIONS = Object.entries(AREA_LABEL) as [MinistryArea, string][];
const STATUS_COLOR: Record<Status,string> = {
  ativo: "bg-success/15 text-success",
  pendente: "bg-warning/15 text-warning",
  inativo: "bg-muted text-muted-foreground",
};
const STATUS_LABEL: Record<Status,string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  inativo: "Inativo",
};

export default function Equipe() {
  const { isAdmin, user, roles } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [confirmDel, setConfirmDel] = useState<Member | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: ps, error: e1 }, { data: rs, error: e2 }] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email,avatar_url,status,ministry_role,ministry_area,phone").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    if (e1 || e2) {
      await logIfDenied(e1 || e2, { resource: "profiles/user_roles", action: "select" });
      console.warn("Membros carregados parcialmente.", e1 || e2);
    }
    const map = new Map<string, Role[]>();
    ((rs ?? []) as RoleRow[]).forEach((r) => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role); map.set(r.user_id, arr);
    });
    // Resolve signed URLs in parallel via the cached helper (avoids duplicate sign calls).
    const profiles = (ps ?? []) as ProfileRow[];
    const signedUrls = await getAvatarUrls(profiles.map((p) => p.avatar_url));
    const list = profiles.map((p, i): Member => ({
      ...p,
      avatar_url: signedUrls[i],
      roles: map.get(p.id) ?? [],
    }));
    setMembers(list);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (m: Member, status: Status) => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", m.id);
    if (error) {
      await logIfDenied(error, { resource: "profiles", action: "update", details: { target: m.id, field: "status" } });
      return showError(error, "Não foi possível atualizar o status.");
    }
    await logAccess({ event: status === "ativo" ? "member_approve" : "member_reject", resource: "profiles", action: "update", details: { target: m.id, status } });
    toast.success("Status atualizado");
    load();
  };

  const setPrimaryRole = async (m: Member, role: Role) => {
    // remove papéis existentes e adiciona o novo
    const { error: e1 } = await supabase.from("user_roles").delete().eq("user_id", m.id);
    if (e1) { await logIfDenied(e1, { resource: "user_roles", action: "delete", details: { target: m.id } }); return showError(e1, "Não foi possível atualizar o papel."); }
    const { error: e2 } = await supabase.from("user_roles").insert({ user_id: m.id, role });
    if (e2) { await logIfDenied(e2, { resource: "user_roles", action: "insert", details: { target: m.id, role } }); return showError(e2, "Não foi possível atualizar o papel."); }
    await logAccess({ event: "role_change", resource: "user_roles", action: "update", details: { target: m.id, role } });
    toast.success("Papel atualizado");
    load();
  };

  const updateRoleField = async (m: Member, field: "ministry_role" | "ministry_area", val: string) => {
    const update: TablesUpdate<"profiles"> = field === "ministry_area"
      ? { ministry_area: val as MinistryArea }
      : { ministry_role: val };
    const { error } = await supabase.from("profiles").update(update).eq("id", m.id);
    if (error) { await logIfDenied(error, { resource: "profiles", action: "update", details: { target: m.id, field } }); return showError(error, "Não foi possível salvar."); }
    load();
  };

  const removeMember = async (m: Member) => {
    const { error } = await supabase.from("profiles").delete().eq("id", m.id);
    if (error) { await logIfDenied(error, { resource: "profiles", action: "delete", details: { target: m.id } }); return showError(error, "Não foi possível remover o membro."); }
    toast.success("Membro removido");
    setConfirmDel(null); load();
  };

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesQ = !q || [m.full_name, m.email, m.ministry_role].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesArea = areaFilter === "all" || (m.ministry_area ?? "geral") === areaFilter;
      const matchesRole = roleFilter === "all" || m.roles.includes(roleFilter as Role);
      return matchesQ && matchesStatus && matchesArea && matchesRole;
    });
  }, [members, q, roleFilter, statusFilter, areaFilter]);

  useEffect(() => { setPage(1); }, [q, statusFilter, areaFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendentes = members.filter((m) => m.status === "pendente");

  const canExport = isAdmin || roles.includes("coordenador");
  const buildExportRows = () => {
    return filtered.map((m) => ({
      Nome: m.full_name,
      Email: m.email ?? "",
      Telefone: m.phone ?? "",
      Status: STATUS_LABEL[m.status],
      Área: m.ministry_area ? AREA_LABEL[m.ministry_area] : "",
      Função: m.ministry_role ?? "",
      Papéis: m.roles.map(r => ROLE_LABEL[r]).join(", "),
    }));
  };
  const COLS = ["Nome","Email","Telefone","Status","Área","Função","Papéis"];

  const onExportCSV = async () => {
    exportCSV(`equipe-${new Date().toISOString().slice(0,10)}.csv`, COLS, buildExportRows());
    await logAccess({ event: "export", resource: "profiles", action: "export_csv", details: { count: filtered.length } });
  };
  const onExportPDF = async () => {
    exportPDF(`equipe-${new Date().toISOString().slice(0,10)}.pdf`, "Equipe — Ministério Missionário IBK", COLS, buildExportRows(), `Total: ${filtered.length} membros`);
    await logAccess({ event: "export", resource: "profiles", action: "export_pdf", details: { count: filtered.length } });
  };

  return (
    <AppLayout greeting="Equipe & Acessos">
      <CrmHero
        eyebrow="Equipe"
        title="Papéis, responsáveis e acesso da operação missionária em uma só tela."
        description="Aprove cadastros, ajuste áreas de atuação, defina permissões e mantenha a equipe pronta para usar o CRM com segurança."
      />

      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
          <p className="text-xs uppercase text-muted-foreground">Total membros</p>
          <p className="text-2xl font-bold mt-1 text-gradient">{members.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
          <p className="text-xs uppercase text-muted-foreground">Ativos</p>
          <p className="text-2xl font-bold mt-1 text-success">{members.filter(m=>m.status==="ativo").length}</p>
        </Card>
        <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
          <p className="text-xs uppercase text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold mt-1 text-warning">{pendentes.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
          <p className="text-xs uppercase text-muted-foreground">Admins</p>
          <p className="text-2xl font-bold mt-1">{members.filter(m=>m.roles.includes("admin")).length}</p>
        </Card>
        <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
          <p className="text-xs uppercase text-muted-foreground">Coordenadores</p>
          <p className="text-2xl font-bold mt-1">{members.filter(m=>m.roles.includes("coordenador")).length}</p>
        </Card>
      </section>

      {isAdmin && pendentes.length > 0 && (
        <Card className="p-5 bg-warning/5 border-warning/40 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-warning" />
            <h3 className="font-semibold">Cadastros aguardando aprovação ({pendentes.length})</h3>
          </div>
          <ul className="space-y-2">
            {pendentes.map((m) => (
              <li key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                <Avatar className="h-9 w-9"><AvatarFallback>{m.full_name.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{m.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => updateStatus(m, "inativo")}>
                  <X className="h-4 w-4 mr-1" /> Recusar
                </Button>
                <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => updateStatus(m, "ativo")}>
                  <Check className="h-4 w-4 mr-1" /> Aprovar
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-4 bg-gradient-card border-border/60 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, e-mail ou função..." className="pl-9 bg-background" value={q} onChange={(e)=>setQ(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-44 bg-background"><SelectValue placeholder="Área" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {AREA_OPTIONS.map(([value, label])=>(
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-44 bg-background"><SelectValue placeholder="Papel" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos papéis</SelectItem>
              {(["admin","coordenador","editor","voluntario"] as Role[]).map((role)=>(
                <SelectItem key={role} value={role}>{ROLE_LABEL[role]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportCSV}><FileText className="h-4 w-4 mr-2" /> CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={onExportPDF}><FileText className="h-4 w-4 mr-2" /> PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/60 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando…</div>
        ) : pageItems.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">Nenhum membro encontrado com esses filtros.</div>
        ) : (
          <ul className="divide-y divide-border">
            {pageItems.map((m) => (
              <li key={m.id} className="px-5 py-4 flex flex-wrap items-center gap-3">
                <Avatar className="h-11 w-11">
                  {m.avatar_url && <AvatarImage src={m.avatar_url} />}
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">{m.full_name.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold">{m.full_name}{m.id===user?.id && <span className="ml-2 text-xs text-muted-foreground">(você)</span>}</p>
                  <p className="text-xs text-muted-foreground">{m.email} {m.phone && `· ${m.phone}`}</p>
                </div>

                <Badge className={STATUS_COLOR[m.status]}>{STATUS_LABEL[m.status]}</Badge>

                {isAdmin ? (
                  <>
                    <Input
                      defaultValue={m.ministry_role ?? ""}
                      placeholder="Função (Diretor, Secretário…)"
                      className="w-44 bg-background"
                      onBlur={(e)=> e.target.value !== (m.ministry_role ?? "") && updateRoleField(m, "ministry_role", e.target.value)}
                    />
                    <Select defaultValue={m.ministry_area ?? "geral"} onValueChange={(v)=>updateRoleField(m,"ministry_area", v)}>
                      <SelectTrigger className="w-36 bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {AREA_OPTIONS.map(([value, label])=>(
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue={m.roles[0] ?? "voluntario"} onValueChange={(v)=>setPrimaryRole(m, v as Role)}>
                      <SelectTrigger className="w-36 bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["admin","coordenador","editor","voluntario"] as Role[]).map(r=>(
                          <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue={m.status} onValueChange={(v)=>updateStatus(m, v as Status)}>
                      <SelectTrigger className="w-32 bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    {m.id !== user?.id && (
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={()=>setConfirmDel(m)}>Remover</Button>
                    )}
                  </>
                ) : (
                  <>
                    {m.ministry_area && <Badge variant="outline">{AREA_LABEL[m.ministry_area]}</Badge>}
                    {m.ministry_role && <Badge variant="secondary"><UserCog className="mr-1 h-3 w-3" />{m.ministry_role}</Badge>}
                    {m.roles.map(r => <Badge key={r} className="bg-primary/10 text-primary">{ROLE_LABEL[r]}</Badge>)}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/60 text-sm">
            <span className="text-muted-foreground">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>{page} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={!!confirmDel} onOpenChange={(v)=>!v && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {confirmDel?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>O perfil será excluído. O usuário precisará se cadastrar novamente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={()=> confirmDel && removeMember(confirmDel)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
