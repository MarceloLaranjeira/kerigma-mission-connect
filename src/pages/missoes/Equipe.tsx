import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Users, Search, Check, X, Loader2, ShieldCheck } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Status = "pendente" | "ativo" | "inativo";
type Role = "admin" | "coordenador" | "editor" | "voluntario";

interface Member {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  status: Status;
  ministry_role: string | null;
  ministry_area: string | null;
  phone: string | null;
  roles: Role[];
}

const ROLE_LABEL: Record<Role,string> = {
  admin: "Admin", coordenador: "Coordenador", editor: "Editor", voluntario: "Voluntário",
};
const STATUS_COLOR: Record<Status,string> = {
  ativo: "bg-success/15 text-success",
  pendente: "bg-warning/15 text-warning",
  inativo: "bg-muted text-muted-foreground",
};

export default function Equipe() {
  const { isAdmin, user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState<Member | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: ps, error: e1 }, { data: rs, error: e2 }] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email,avatar_url,status,ministry_role,ministry_area,phone").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    if (e1 || e2) toast.error(e1?.message || e2?.message);
    const map = new Map<string, Role[]>();
    (rs ?? []).forEach((r: any) => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role); map.set(r.user_id, arr);
    });
    setMembers((ps ?? []).map((p: any) => ({ ...p, roles: map.get(p.id) ?? [] })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (m: Member, status: Status) => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success("Status atualizado");
    load();
  };

  const setPrimaryRole = async (m: Member, role: Role) => {
    // remove papéis existentes e adiciona o novo
    const { error: e1 } = await supabase.from("user_roles").delete().eq("user_id", m.id);
    if (e1) return toast.error(e1.message);
    const { error: e2 } = await supabase.from("user_roles").insert({ user_id: m.id, role });
    if (e2) return toast.error(e2.message);
    toast.success("Papel atualizado");
    load();
  };

  const updateRoleField = async (m: Member, field: "ministry_role" | "ministry_area", val: string) => {
    const { error } = await supabase.from("profiles").update({ [field]: val }).eq("id", m.id);
    if (error) return toast.error(error.message);
    load();
  };

  const removeMember = async (m: Member) => {
    const { error } = await supabase.from("profiles").delete().eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success("Membro removido");
    setConfirmDel(null); load();
  };

  const filtered = members.filter((m) =>
    [m.full_name, m.email, m.ministry_role].join(" ").toLowerCase().includes(q.toLowerCase())
  );
  const pendentes = members.filter((m) => m.status === "pendente");

  return (
    <AppLayout greeting="Equipe & Acessos">
      <Card className="p-6 bg-gradient-hero text-white border-0 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/15 ring-1 ring-white/20 flex items-center justify-center backdrop-blur">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Capítulo V — Estrutura Organizacional</p>
            <h1 className="text-2xl font-bold">Membros do Ministério Missionário</h1>
            <p className="text-sm text-white/80">Aprove novos cadastros, defina papéis e controle os acessos da equipe.</p>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar membro..." className="pl-9 bg-background" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/60 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando…</div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((m) => (
              <li key={m.id} className="px-5 py-4 flex flex-wrap items-center gap-3">
                <Avatar className="h-11 w-11">
                  {m.avatar_url && <AvatarImage src={m.avatar_url} />}
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">{m.full_name.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold">{m.full_name}{m.id===user?.id && <span className="ml-2 text-xs text-muted-foreground">(você)</span>}</p>
                  <p className="text-xs text-muted-foreground">{m.email} {m.phone && `· ${m.phone}`}</p>
                </div>

                <Badge className={STATUS_COLOR[m.status]}>{m.status}</Badge>

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
                        {["geral","locais","ribeirinhas","nacionais","mundiais","discipulado","treinamento","tesouraria"].map(o=>(
                          <SelectItem key={o} value={o}>{o}</SelectItem>
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
                    {m.ministry_role && <Badge variant="secondary">{m.ministry_role}</Badge>}
                    {m.roles.map(r => <Badge key={r} className="bg-primary/10 text-primary">{ROLE_LABEL[r]}</Badge>)}
                  </>
                )}
              </li>
            ))}
          </ul>
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
