import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Configuracoes() {
  const { user, profile, refresh, signOut } = useAuth();
  const [form, setForm] = useState({
    full_name: "", phone: "", neighborhood: "", birth_date: "",
    joined_at: "", baptism_date: "", small_group: "", gifts: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        full_name: data.full_name ?? "",
        phone: data.phone ?? "",
        neighborhood: data.neighborhood ?? "",
        birth_date: data.birth_date ?? "",
        joined_at: data.joined_at ?? "",
        baptism_date: data.baptism_date ?? "",
        small_group: data.small_group ?? "",
        gifts: data.gifts ?? "",
      });
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return; setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone || null,
      neighborhood: form.neighborhood || null,
      birth_date: form.birth_date || null,
      joined_at: form.joined_at || null,
      baptism_date: form.baptism_date || null,
      small_group: form.small_group || null,
      gifts: form.gifts || null,
    }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Perfil atualizado");
    refresh();
  };

  return (
    <AppLayout greeting="Configurações">
      <Card className="p-6 bg-gradient-hero text-white border-0 shadow-elegant">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center"><Settings className="h-7 w-7" /></div>
          <div>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <p className="text-white/80 text-sm">Atualize suas informações ministeriais.</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-card border-border/60 shadow-card lg:col-span-1">
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto"><AvatarFallback className="bg-gradient-primary text-white text-xl">{(profile?.full_name ?? "U").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
            <p className="font-semibold mt-3">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
            <p className="text-xs mt-2"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary">{profile?.status}</span></p>
          </div>
          <Button variant="outline" className="w-full mt-6" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </Card>

        <Card className="p-5 bg-gradient-card border-border/60 shadow-card lg:col-span-2">
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2"><Label>Nome completo</Label><Input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} /></div>
            <div><Label>Telefone</Label><Input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
            <div><Label>Bairro</Label><Input value={form.neighborhood} onChange={e=>setForm({...form,neighborhood:e.target.value})} /></div>
            <div><Label>Data de nascimento</Label><Input type="date" value={form.birth_date} onChange={e=>setForm({...form,birth_date:e.target.value})} /></div>
            <div><Label>Data de batismo</Label><Input type="date" value={form.baptism_date} onChange={e=>setForm({...form,baptism_date:e.target.value})} /></div>
            <div><Label>Ingresso na IBK</Label><Input type="date" value={form.joined_at} onChange={e=>setForm({...form,joined_at:e.target.value})} /></div>
            <div><Label>Grupo de Comunhão (GC)</Label><Input value={form.small_group} onChange={e=>setForm({...form,small_group:e.target.value})} /></div>
            <div className="md:col-span-2"><Label>Dons / Talentos</Label><Textarea rows={3} value={form.gifts} onChange={e=>setForm({...form,gifts:e.target.value})} /></div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={busy} className="bg-gradient-primary text-white">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Salvar</>}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
