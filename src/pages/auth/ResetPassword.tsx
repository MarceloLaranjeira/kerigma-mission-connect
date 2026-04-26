import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { friendlyError } from "@/lib/errors";
import { Loader2, KeyRound } from "lucide-react";
import logo from "@/assets/logo-kerygma.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // O Supabase processa o hash automaticamente e dispara PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Caso o evento já tenha passado, verificar sessão
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("As senhas não coincidem");
    if (password.length < 6) return toast.error("Mínimo de 6 caracteres");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(friendlyError(error, "Não foi possível redefinir a senha."));
    toast.success("Senha atualizada! Faça login novamente.");
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8 bg-gradient-card border-border/60 shadow-elegant">
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="IBK" className="h-10 w-10" />
          <div>
            <p className="font-bold leading-tight">Kerygma Missões</p>
            <p className="text-xs text-muted-foreground">Redefinição de senha</p>
          </div>
        </div>

        <KeyRound className="h-10 w-10 text-primary mb-3" />
        <h2 className="text-xl font-bold">Defina uma nova senha</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Escolha uma senha segura para acessar o painel da Equipe de Missões.
        </p>

        {!ready ? (
          <p className="text-sm text-muted-foreground">Validando link de recuperação…</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="np">Nova senha</Label>
              <Input id="np" type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cp">Confirmar senha</Label>
              <Input id="cp" type="password" minLength={6} required value={confirm} onChange={e=>setConfirm(e.target.value)} />
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-white shadow-elegant">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redefinir senha"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}