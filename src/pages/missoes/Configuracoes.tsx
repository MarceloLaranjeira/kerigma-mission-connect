import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Configuracoes() {
  return (
    <AppLayout greeting="Configurações">
      <Card className="p-6 bg-gradient-hero text-white border-0 shadow-elegant">
        <p className="text-xs uppercase tracking-widest text-white/60">Sistema</p>
        <h1 className="text-2xl font-bold">Configurações da IBK Kerygma Missões</h1>
        <p className="text-sm text-white/80">Personalize o sistema de acordo com a identidade e processos do ministério.</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-card border-border/60 shadow-card space-y-4">
          <h3 className="font-semibold">Dados da Igreja</h3>
          <div><Label>Nome</Label><Input defaultValue="Igreja Batista Kerygma (IBK)" /></div>
          <div><Label>Sede</Label><Input defaultValue="Manaus — AM" /></div>
          <div><Label>Tema do Ministério</Label><Input defaultValue="Anunciar as Boas Novas de Salvação do Evangelho de CRISTO" /></div>
          <div><Label>Versículo-base</Label><Input defaultValue="João 3:30 — Há uma necessidade que Ele cresça e eu diminua" /></div>
          <Button className="bg-gradient-primary text-white">Salvar</Button>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/60 shadow-card space-y-4">
          <h3 className="font-semibold">Preferências</h3>
          {[
            ["Notificações de novos convertidos", true],
            ["Lembrete diário de visitas", true],
            ["Relatório financeiro mensal automático", true],
            ["Modo escuro", false],
            ["Convidar membros por e-mail", true],
          ].map(([l, v]) => (
            <div key={l as string} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{l}</span>
              <Switch defaultChecked={v as boolean} />
            </div>
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
