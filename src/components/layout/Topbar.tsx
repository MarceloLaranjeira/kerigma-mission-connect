import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Topbar({ greeting }: { greeting?: string }) {
  const { profile, signOut } = useAuth();
  const initials = (profile?.full_name ?? "U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const display = greeting ?? `Bem-vindo, ${profile?.full_name?.split(" ")[0] ?? "Equipe"}!`;

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="hidden md:block">
          <p className="text-lg font-semibold flex items-center gap-2">
            <span className="text-warning">☀</span> {display}
          </p>
          <p className="text-sm text-muted-foreground">Equipe de Missões — Igreja Batista Kerygma</p>
        </div>
        <div className="flex-1 max-w-md ml-auto relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar missionário, convertido, projeto..." className="pl-9 bg-secondary/60 border-transparent" />
        </div>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 ring-2 ring-primary/30 cursor-pointer">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name} />}
              <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground font-normal">{profile?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/perfil"><User className="h-4 w-4 mr-2" /> Meu perfil</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/configuracoes"><Settings className="h-4 w-4 mr-2" /> Configurações</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/equipe"><Settings className="h-4 w-4 mr-2" /> Equipe</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
