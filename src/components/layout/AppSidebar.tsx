import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, HeartHandshake, Waves, Globe2, MapPin,
  ScrollText, Calendar, BookOpen, GraduationCap, Coins, Megaphone,
  ClipboardList, Settings, UserCog, Sparkles
} from "lucide-react";
import logo from "@/assets/logo-kerygma.png";

const groups = [
  {
    label: "Visão Geral",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Painel" },
      { to: "/agenda", icon: Calendar, label: "Agenda Missionária" },
    ],
  },
  {
    label: "Frentes Missionárias",
    items: [
      { to: "/locais", icon: MapPin, label: "Missões Locais" },
      { to: "/ribeirinhas", icon: Waves, label: "Missões Ribeirinhas" },
      { to: "/nacionais", icon: HeartHandshake, label: "Missões Nacionais" },
      { to: "/mundiais", icon: Globe2, label: "Missões Mundiais" },
    ],
  },
  {
    label: "Discipulado",
    items: [
      { to: "/convertidos", icon: Sparkles, label: "Novos Convertidos", badge: 14 },
      { to: "/visitantes", icon: Users, label: "Visitantes" },
      { to: "/discipulado", icon: BookOpen, label: "Acompanhamento" },
      { to: "/treinamento", icon: GraduationCap, label: "Treinamentos" },
    ],
  },
  {
    label: "Operação",
    items: [
      { to: "/missionarios", icon: UserCog, label: "Missionários" },
      { to: "/projetos", icon: ClipboardList, label: "Projetos & Viagens" },
      { to: "/campanhas", icon: Megaphone, label: "Campanhas" },
      { to: "/tesouraria", icon: Coins, label: "Tesouraria" },
      { to: "/atas", icon: ScrollText, label: "Atas & Relatórios" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/equipe", icon: Users, label: "Equipe & Acessos" },
      { to: "/configuracoes", icon: Settings, label: "Configurações" },
    ],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-10 w-10 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Kerygma Missões" width={40} height={40} className="object-contain" />
        </div>
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-widest text-sidebar-foreground/60">IBK</p>
          <p className="font-semibold text-white">Kerygma Missões</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-sidebar-foreground/40">
              {g.label}
            </p>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = pathname === it.to;
                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth ${
                        active
                          ? "bg-gradient-primary text-white shadow-elegant"
                          : "hover:bg-sidebar-accent hover:text-white"
                      }`}
                    >
                      <it.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{it.label}</span>
                      {"badge" in it && it.badge ? (
                        <span className="text-[10px] font-semibold bg-accent text-accent-foreground rounded-full px-2 py-0.5">
                          {it.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 p-4 rounded-xl bg-gradient-primary text-white shadow-elegant">
        <p className="text-xs opacity-80">Cultura Kerygma</p>
        <p className="text-sm font-semibold leading-snug mt-1">
          "Pregar o Evangelho em todas as direções"
        </p>
        <p className="text-[11px] opacity-75 mt-2">João 3:30</p>
      </div>
    </aside>
  );
}
