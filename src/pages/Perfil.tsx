import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { type Enums, type TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { showError } from "@/lib/errors";
import { invalidateAvatar } from "@/lib/avatarCache";
import { Loader2, Camera, ShieldCheck, Clock, BadgeCheck, KeyRound, Sparkles, Heart, Download, FileText, Info, CheckCircle2, XCircle, HelpCircle, type LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button as UIButton } from "@/components/ui/button";
import { exportCSV, exportPDF } from "@/lib/exportData";
import { logAccess, logIfDenied } from "@/lib/accessLog";

const AREAS: Enums<"ministry_area">[] = ["geral","locais","ribeirinhas","nacionais","mundiais","discipulado","treinamento","tesouraria"];

const STATUS_BADGE: Record<Enums<"member_status">, { label: string; cls: string; icon: LucideIcon }> = {
  ativo:    { label: "Aprovado", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: BadgeCheck },
  pendente: { label: "Pendente", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30", icon: Clock },
  inativo:  { label: "Inativo",  cls: "bg-muted text-muted-foreground border-border", icon: ShieldCheck },
};

type ProfileForm = {
  full_name: string;
  phone: string;
  birth_date: string;
  neighborhood: string;
  ministry_role: string;
  ministry_area: Enums<"ministry_area">;
  baptism_date: string;
  small_group: string;
  ebk_completed: boolean;
  gifts: string;
};

export default function Perfil() {
  const { user, profile, roles, refresh, isAdmin } = useAuth();
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileForm>({
    full_name: "", phone: "", birth_date: "", neighborhood: "",
    ministry_role: "", ministry_area: "geral",
    baptism_date: "", small_group: "", ebk_completed: false,
    gifts: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      birth_date: profile.birth_date ?? "",
      neighborhood: profile.neighborhood ?? "",
      ministry_role: profile.ministry_role ?? "",
      ministry_area: profile.ministry_area ?? "geral",
      baptism_date: profile.baptism_date ?? "",
      small_group: profile.small_group ?? "",
      ebk_completed: !!profile.ebk_completed,
      gifts: profile.gifts ?? "",
    });
  }, [profile]);

  if (!profile || !user) return null;

  const initials = (profile.full_name ?? "U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const status = STATUS_BADGE[profile.status] ?? STATUS_BADGE.pendente;
  const StIcon = status.icon;

  const onSave = async () => {
    setBusy(true);
    const payload: TablesUpdate<"profiles"> = {
      full_name: form.full_name,
      phone: form.phone || null,
      birth_date: form.birth_date || null,
      neighborhood: form.neighborhood || null,
      ministry_role: form.ministry_role || null,
      ministry_area: form.ministry_area,
      baptism_date: form.baptism_date || null,
      small_group: form.small_group || null,
      ebk_completed: form.ebk_completed,
      gifts: form.gifts || null,
    };
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setBusy(false);
    if (error) {
      await logIfDenied(error, { resource: "profiles", action: "update_self" });
      return showError(error, "Não foi possível salvar o perfil.");
    }
    await logAccess({ event: "profile_update", resource: "profiles", action: "update_self" });
    toast.success("Perfil atualizado");
    refresh();
  };

  const onUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) return toast.error("Máximo 4 MB");
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); return showError(upErr, "Não foi possível enviar a imagem."); }
    invalidateAvatar(path);
    // Store the storage path (private bucket); signed URL is generated when displaying.
    const { error: dbErr } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
    setUploading(false);
    if (dbErr) { await logIfDenied(dbErr, { resource: "profiles", action: "update_avatar" }); return showError(dbErr, "Não foi possível atualizar o perfil."); }
    toast.success("Foto atualizada");
    refresh();
  };

  const onResetPwd = async () => {
    if (!profile.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return showError(error, "Não foi possível enviar o link.");
    toast.success("Enviamos um link de redefinição para o seu e-mail.");
  };

  const buildExportRow = () => ([{
    Nome: form.full_name,
    Email: profile.email ?? "",
    Telefone: form.phone,
    "Data de nascimento": form.birth_date,
    Bairro: form.neighborhood,
    "Função ministerial": form.ministry_role,
    "Área de atuação": form.ministry_area,
    "Data de batismo": form.baptism_date,
    "Pequeno grupo": form.small_group,
    "EBK concluída": form.ebk_completed ? "Sim" : "Não",
    "Dons espirituais": form.gifts,
    Status: profile.status,
    Papéis: roles.join(", "),
  }]);
  const COLS = ["Nome","Email","Telefone","Data de nascimento","Bairro","Função ministerial","Área de atuação","Data de batismo","Pequeno grupo","EBK concluída","Dons espirituais","Status","Papéis"];

  const onExportCSV = async () => {
    exportCSV(`meu-perfil-${new Date().toISOString().slice(0,10)}.csv`, COLS, buildExportRow());
    await logAccess({ event: "export", resource: "profiles", action: "export_csv_self" });
  };
  const onExportPDF = async () => {
    exportPDF(`meu-perfil-${new Date().toISOString().slice(0,10)}.pdf`, "Meu Perfil — IBK", COLS, buildExportRow());
    await logAccess({ event: "export", resource: "profiles", action: "export_pdf_self" });
  };

  // Aprovação pendente: o que falta e o que pode/não pode fazer
  const isPending = profile.status === "pendente";
  const isInactive = profile.status === "inativo";
  const canEditApp = profile.status === "ativo" && roles.some(r => ["admin","coordenador","editor"].includes(r));

  return (
    <AppLayout greeting="Meu Perfil">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna esquerda — identidade & status */}
        <Card className="p-6 bg-gradient-card border-border/60 shadow-card lg:col-span-1 space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-28 w-28 ring-4 ring-primary/20">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name} />}
                <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-elegant hover:scale-105 transition"
                aria-label="Alterar foto"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
            </div>
            <h2 className="mt-4 font-bold text-lg">{profile.full_name}</h2>
            <p className="text-xs text-muted-foreground">{profile.email}</p>

            <Badge variant="outline" className={`mt-3 gap-1 ${status.cls}`}>
              <StIcon className="h-3 w-3" /> {status.label}
            </Badge>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <UIButton variant="ghost" size="sm" className="mt-1 gap-1 text-xs text-muted-foreground">
                    <HelpCircle className="h-3.5 w-3.5" /> O que esse status significa?
                  </UIButton>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-left">
                  {isPending && <p>Seu cadastro está aguardando aprovação. Um Administrador ou Coordenador precisa aprovar você na aba <strong>Equipe</strong>.</p>}
                  {isInactive && <p>Sua conta está inativa. Solicite a reativação a um Administrador.</p>}
                  {profile.status === "ativo" && <p>Sua conta está ativa. Suas permissões dependem dos papéis atribuídos.</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Papéis</p>
              <div className="flex flex-wrap gap-1.5">
                {roles.length === 0 && <span className="text-sm text-muted-foreground">—</span>}
                {roles.map((r) => (
                  <Badge key={r} className="capitalize bg-primary/15 text-primary hover:bg-primary/20 border-0">{r}</Badge>
                ))}
              </div>
            </div>

            {isPending && (
              <div className="text-xs bg-amber-500/10 border border-amber-500/20 rounded-md p-3 space-y-2">
                <p className="font-semibold text-amber-700 flex items-center gap-1.5"><Info className="h-3.5 w-3.5" /> Aguardando aprovação</p>
                <p className="text-amber-700/90">Para liberar seu acesso completo:</p>
                <ul className="space-y-1 text-amber-700/90 list-disc list-inside">
                  <li>Complete seus dados básicos e ministeriais nesta página</li>
                  <li>Avise um Coordenador ou Administrador que você se cadastrou</li>
                  <li>Aguarde a aprovação na aba <strong>Equipe</strong></li>
                </ul>
                <div className="border-t border-amber-500/30 pt-2 mt-2">
                  <p className="font-semibold text-amber-700 mb-1">O que você pode fazer agora:</p>
                  <p className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Editar seu perfil e enviar foto</p>
                  <p className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Visualizar páginas do ministério</p>
                  <p className="flex items-center gap-1.5 text-rose-700 mt-1"><XCircle className="h-3.5 w-3.5" /> Criar / editar / excluir registros</p>
                  <p className="flex items-center gap-1.5 text-rose-700"><XCircle className="h-3.5 w-3.5" /> Aprovar membros ou alterar papéis</p>
                </div>
              </div>
            )}
            {isInactive && (
              <div className="text-xs bg-rose-500/10 border border-rose-500/20 rounded-md p-3 text-rose-700">
                <p className="font-semibold mb-1">Conta inativa</p>
                <p>Você pode visualizar seu perfil, mas não pode editar registros do ministério. Solicite reativação a um Administrador.</p>
              </div>
            )}
            {!isPending && !isInactive && (
              <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3 text-emerald-700 space-y-1">
                <p className="font-semibold flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Acesso liberado</p>
                {canEditApp ? (
                  <p>Você pode visualizar e editar registros conforme seus papéis.</p>
                ) : (
                  <p>Você pode visualizar todas as páginas do ministério. Edição de registros requer papel de Editor, Coordenador ou Admin.</p>
                )}
              </div>
            )}
            {isAdmin && (
              <p className="text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2">
                Você é Administrador — gerencie membros em <strong>Equipe</strong>.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Button variant="outline" onClick={onResetPwd} className="w-full">
              <KeyRound className="h-4 w-4 mr-2" /> Redefinir senha por e-mail
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" /> Exportar meus dados</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onExportCSV}><FileText className="h-4 w-4 mr-2" /> Baixar CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={onExportPDF}><FileText className="h-4 w-4 mr-2" /> Baixar PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Coluna direita — formulário */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-gradient-card border-border/60 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Dados básicos</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome completo">
                <Input value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})} />
              </Field>
              <Field label="Telefone / WhatsApp">
                <Input value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} placeholder="(92) 9 9999-9999" />
              </Field>
              <Field label="Data de nascimento">
                <Input type="date" value={form.birth_date} onChange={(e)=>setForm({...form, birth_date: e.target.value})} />
              </Field>
              <Field label="Bairro (Manaus)">
                <Input value={form.neighborhood} onChange={(e)=>setForm({...form, neighborhood: e.target.value})} />
              </Field>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/60 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Dados ministeriais</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Função no ministério">
                <Input value={form.ministry_role} onChange={(e)=>setForm({...form, ministry_role: e.target.value})} placeholder="Ex.: Líder de viagem ribeirinha" />
              </Field>
              <Field label="Área de atuação">
                <Select value={form.ministry_area} onValueChange={(v)=>setForm({...form, ministry_area: v as Enums<"ministry_area">})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AREAS.map(a => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Data de batismo">
                <Input type="date" value={form.baptism_date} onChange={(e)=>setForm({...form, baptism_date: e.target.value})} />
              </Field>
              <Field label="Pequeno grupo / célula">
                <Input value={form.small_group} onChange={(e)=>setForm({...form, small_group: e.target.value})} />
              </Field>
              <div className="sm:col-span-2 flex items-center justify-between rounded-md border border-border/60 p-3">
                <div>
                  <p className="font-medium text-sm">EBK concluída</p>
                  <p className="text-xs text-muted-foreground">Escola Bíblica Kerygma</p>
                </div>
                <Switch checked={form.ebk_completed} onCheckedChange={(v)=>setForm({...form, ebk_completed: v})} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/60 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Dons espirituais</h3>
            </div>
            <Textarea
              rows={4}
              placeholder="Descreva os dons espirituais que Deus tem usado em sua vida (ensino, evangelismo, intercessão, hospitalidade, música, etc.)"
              value={form.gifts}
              onChange={(e)=>setForm({...form, gifts: e.target.value})}
            />
          </Card>

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={busy} className="bg-gradient-primary text-white shadow-elegant">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
