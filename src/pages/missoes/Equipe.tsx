import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Shield } from "lucide-react";

const equipe = [
  { nome: "Pr Guilherme", cargo: "Diretor de Missões", area: "Geral", acesso: "Administrador", cor: "bg-primary" },
  { nome: "Pr Daniel", cargo: "Subdiretor de Missões", area: "Geral", acesso: "Administrador", cor: "bg-primary" },
  { nome: "Coord. Locais (a definir)", cargo: "Coordenador(a) Missões Locais", area: "Locais", acesso: "Coordenador", cor: "bg-accent" },
  { nome: "Alex e Isa", cargo: "Coordenadores Missões Nacionais", area: "Nacionais", acesso: "Coordenador", cor: "bg-warning" },
  { nome: "Pr Marcos & Kelly", cargo: "Coordenadores Missões Ribeirinhas", area: "Ribeirinhas", acesso: "Coordenador", cor: "bg-success" },
  { nome: "Pr Roberto", cargo: "Coordenador Missões Mundiais", area: "Mundiais", acesso: "Coordenador", cor: "bg-primary-glow" },
  { nome: "Sara e Agata", cargo: "Secretárias Administrativas", area: "Secretaria", acesso: "Editor", cor: "bg-accent" },
  { nome: "Tesoureiro(a) (a definir)", cargo: "Tesoureiro(a) de Missões", area: "Tesouraria", acesso: "Editor", cor: "bg-warning" },
  { nome: "Equipe de Apoio", cargo: "Voluntários (Membros e Congregações)", area: "Apoio", acesso: "Voluntário", cor: "bg-muted-foreground" },
];

export default function Equipe() {
  return (
    <AppLayout greeting="Equipe & Acessos">
      <Card className="p-6 bg-gradient-hero text-white border-0 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/60">Capítulo V — Estrutura Organizacional</p>
          <h1 className="text-2xl font-bold">Equipe da IBK Missões</h1>
          <p className="text-sm text-white/80 max-w-3xl mt-1">Gerencie membros do ministério e seus respectivos acessos ao sistema, conforme função e responsabilidade.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {equipe.map((m) => (
          <Card key={m.nome} className="p-5 bg-gradient-card border-border/60 shadow-card hover:shadow-elegant transition-smooth">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`${m.cor} text-white font-bold`}>
                  {m.nome.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{m.nome}</p>
                <p className="text-sm text-muted-foreground">{m.cargo}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Badge variant="secondary">{m.area}</Badge>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Shield className="h-3 w-3" /> {m.acesso}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1"><Mail className="h-3 w-3 mr-1" /> E-mail</Button>
              <Button size="sm" variant="outline" className="flex-1"><Phone className="h-3 w-3 mr-1" /> Contato</Button>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
