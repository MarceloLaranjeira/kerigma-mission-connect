import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { friendlyError } from "@/lib/errors";
import { Loader2, Heart, Globe2, Waves, Sparkles, ShieldCheck, UserPlus, Crown, CheckCircle2, MailCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-kerygma.png";
import hero from "@/assets/missions-hero.jpg";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"entrar"|"cadastrar"|"recuperar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [signupResult, setSignupResult] = useState<null | { needsConfirm: boolean; isFirst: boolean }>(null);

  if (!loading && user) return <Navigate to="/" replace />;

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(friendlyError(error, "Não foi possível entrar."));
    toast.success("Bem-vindo de volta!");
    navigate("/");
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    // detecta se é o primeiro cadastro (vira admin automaticamente)
    const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true });
    const isFirst = (count ?? 0) === 0;
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(friendlyError(error, "Não foi possível concluir o cadastro."));
    const needsConfirm = !data.session; // sem sessão = precisa confirmar email
    setSignupResult({ needsConfirm, isFirst });
  };

  const onRecover = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(friendlyError(error, "Não foi possível enviar o link."));
    toast.success("Enviamos um link para o seu e-mail.");
    setTab("entrar");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* HERO */}
      <div className="relative hidden lg:block overflow-hidden">
        <img src={hero} alt="Missões IBK" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-accent/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-3">
            <img src={logo} alt="IBK" className="h-12 w-12 rounded-xl bg-white/10 ring-1 ring-white/20 p-1" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Igreja Batista Kerygma</p>
              <p className="font-bold text-lg">Manaus · Amazonas</p>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Pregar o Evangelho <br />em <span className="text-accent-foreground bg-white/20 px-2 rounded">todas as direções</span>.
            </h1>
            <p className="text-white/80">
              CRM oficial do Ministério de Missões da IBK — gerencie convertidos,
              missionários, projetos, viagens ribeirinhas e campanhas.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { i: Waves, t: "Ribeirinhas", s: "18 comunidades" },
                { i: Globe2, t: "Mundiais", s: "12 campos" },
                { i: Sparkles, t: "Convertidos", s: "+717 ano" },
                { i: Heart, t: "Discipulado", s: "143 ativos" },
              ].map((b) => (
                <div key={b.t} className="bg-white/10 backdrop-blur rounded-xl p-3 ring-1 ring-white/15">
                  <b.i className="h-5 w-5 mb-1.5" />
                  <p className="font-semibold text-sm">{b.t}</p>
                  <p className="text-xs opacity-75">{b.s}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs italic opacity-80 border-l-2 border-white/40 pl-3">
            "E sereis minhas testemunhas..." — Atos 1:8
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <Card className="w-full max-w-md p-8 bg-gradient-card border-border/60 shadow-elegant">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <img src={logo} alt="IBK" className="h-10 w-10" />
            <p className="font-bold">Kerygma Missões</p>
          </div>

          {signupResult ? (
            <SignupSuccess result={signupResult} onBack={() => { setSignupResult(null); setTab("entrar"); }} />
          ) : (
          <>
          <h2 className="text-2xl font-bold">Bem-vindo</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Acesse o painel da Equipe de Missões da IBK.
          </p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
              <TabsTrigger value="cadastrar">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar">
              {tab === "recuperar" ? (
                <form onSubmit={onRecover} className="space-y-3">
                  <button type="button" onClick={() => setTab("entrar")} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
                    <ArrowLeft className="h-3 w-3" /> voltar
                  </button>
                  <h3 className="font-semibold">Recuperar acesso</h3>
                  <p className="text-xs text-muted-foreground">
                    Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
                  </p>
                  <div>
                    <Label htmlFor="er">E-mail</Label>
                    <Input id="er" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-white shadow-elegant">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar link de recuperação"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={onLogin} className="space-y-3">
                  <div>
                    <Label htmlFor="e1">E-mail</Label>
                    <Input id="e1" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="p1">Senha</Label>
                    <button type="button" onClick={() => setTab("recuperar")} className="text-xs text-primary hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>
                  <Input id="p1" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} />
                  <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-white shadow-elegant">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="cadastrar">
              <form onSubmit={onSignup} className="space-y-3">
                <div>
                  <Label htmlFor="n2">Nome completo</Label>
                  <Input id="n2" required value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="e2">E-mail</Label>
                  <Input id="e2" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="p2">Senha</Label>
                  <Input id="p2" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-white shadow-elegant">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Solicitar cadastro"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Seu acesso será liberado após aprovação de um coordenador.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Passo a passo */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Como funciona o acesso
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Crown className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">1. Primeiro cadastro vira Admin</p>
                  <p className="text-xs text-muted-foreground">
                    O <strong>primeiro</strong> usuário a se cadastrar é promovido automaticamente
                    a Administrador da IBK.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">2. Demais membros se auto-cadastram</p>
                  <p className="text-xs text-muted-foreground">
                    Cada membro do ministério usa a aba <strong>Cadastrar</strong> e fica como
                    "pendente" até ser aprovado.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">3. Admin aprova em "Equipe"</p>
                  <p className="text-xs text-muted-foreground">
                    No menu <strong>Equipe</strong>, o Admin aprova pendentes e define o papel
                    (Coordenador, Editor ou Voluntário).
                  </p>
                </div>
              </li>
            </ol>
          </div>
          </>
          )}
        </Card>
      </div>
    </div>
  );
}

function SignupSuccess({ result, onBack }: { result: { needsConfirm: boolean; isFirst: boolean }; onBack: () => void }) {
  return (
    <div className="text-center py-4">
      {result.needsConfirm ? (
        <>
          <MailCheck className="h-14 w-14 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-bold">Confirme seu e-mail</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enviamos um link de confirmação para o seu e-mail. Após confirmar, você poderá entrar
            no painel.
          </p>
        </>
      ) : result.isFirst ? (
        <>
          <Crown className="h-14 w-14 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-bold">Você é o Administrador!</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Como primeiro membro cadastrado, você foi promovido a <strong>Administrador</strong> do
            ministério. Já pode entrar e aprovar os próximos membros em <strong>Equipe</strong>.
          </p>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-14 w-14 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-bold">Cadastro recebido</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Seu cadastro está <strong>pendente de aprovação</strong>. Um Coordenador ou
            Administrador da IBK vai liberar seu acesso em breve.
          </p>
        </>
      )}
      <Button onClick={onBack} className="mt-6 w-full bg-gradient-primary text-white">
        Ir para o login
      </Button>
    </div>
  );
}
