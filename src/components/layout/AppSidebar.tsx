import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GitBranch, Activity, CheckSquare, CalendarDays,
  Megaphone, Landmark, Settings, UserCog, BarChart3, Sparkles
} from "lucide-react";
import logo from "@/assets/logo-kerygma.png";

const groups = [
  {
    label: "CRM",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/pessoas", icon: Users, label: "Pessoas" },
      { to: "/pipeline", icon: GitBranch, label: "Pipeline" },
      { to: "/atividades", icon: Activity, label: "Atividades" },
      { to: "/tarefas", icon: CheckSquare, label: "Tarefas" },
    ],
  },
  {
    label: "Operação",
    items: [
      { to: "/agenda", icon: CalendarDays, label: "Agenda" },
      { to: "/campanhas", icon: Megaphone, label: "Campanhas" },
      { to: "/financeiro", icon: Landmark, label: "Financeiro" },
      { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
    ],
  },
  {
    label: "Administração",
    items: [
      { to: "/equipe", icon: UserCog, label: "Equipe & Acessos" },
      { to: "/configuracoes", icon: Settings, label: "Configurações CRM" },
      { to: "/perfil", icon: Sparkles, label: "Meu Perfil" },
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

      <div className="m-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-elegant backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">CRM Kerygma</p>
        <p className="mt-2 text-sm font-semibold leading-snug">
          Acompanhe visitantes, discipulado, campanhas e operação missionária em um só lugar.
        </p>
        <p className="mt-3 text-[11px] text-white/60">Painel operacional da igreja</p>
      </div>
    </aside>
  );
}
