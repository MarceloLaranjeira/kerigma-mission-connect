import { Bell, Search, Plus, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar({ greeting = "Bem-vindo de volta, Equipe Kerygma!" }: { greeting?: string }) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="hidden md:block">
          <p className="text-lg font-semibold flex items-center gap-2">
            <span className="text-warning">☀</span> {greeting}
          </p>
          <p className="text-sm text-muted-foreground">Aqui está o resumo da Equipe de Missões hoje.</p>
        </div>
        <div className="flex-1 max-w-md ml-auto relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar missionário, convertido, projeto..." className="pl-9 bg-secondary/60 border-transparent" />
        </div>
        <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-elegant">
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button size="icon" variant="ghost"><Settings className="h-5 w-5" /></Button>
        <Avatar className="h-9 w-9 ring-2 ring-primary/30">
          <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">PG</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
