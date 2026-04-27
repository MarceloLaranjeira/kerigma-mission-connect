import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GitBranch, Activity, CheckSquare, CalendarDays,
  Megaphone, Landmark, Settings, UserCog, BarChart3, Sparkles, MapPin,
  Waves, Flag, Globe2, ClipboardList, HeartHandshake, UserPlus, BookOpen,
  GraduationCap, FileText, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import logo from "@/assets/logo-kerygma.png";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "kerygma-sidebar-collapsed";
const SIDEBAR_SCROLL_KEY = "kerygma-sidebar-scroll-top";

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
    label: "Missões",
    items: [
      { to: "/missoes", icon: HeartHandshake, label: "Painel Missões" },
      { to: "/missoes/locais", icon: MapPin, label: "Locais" },
      { to: "/missoes/ribeirinhas", icon: Waves, label: "Ribeirinhas" },
      { to: "/missoes/nacionais", icon: Flag, label: "Nacionais" },
      { to: "/missoes/mundiais", icon: Globe2, label: "Mundiais" },
      { to: "/missoes/projetos", icon: ClipboardList, label: "Projetos & Viagens" },
      { to: "/missoes/missionarios", icon: HeartHandshake, label: "Missionários" },
      { to: "/missoes/convertidos", icon: UserPlus, label: "Convertidos" },
      { to: "/missoes/visitantes", icon: Users, label: "Visitantes" },
      { to: "/missoes/discipulado", icon: BookOpen, label: "Discipulado" },
      { to: "/missoes/treinamento", icon: GraduationCap, label: "Treinamento" },
      { to: "/missoes/agenda", icon: CalendarDays, label: "Agenda Missões" },
      { to: "/missoes/campanhas", icon: Megaphone, label: "Campanhas Missões" },
      { to: "/missoes/tesouraria", icon: Landmark, label: "Tesouraria Missões" },
      { to: "/missoes/atas", icon: FileText, label: "Atas" },
    ],
  },
  {
    label: "Administração",
    items: [
      { to: "/equipe", icon: UserCog, label: "Equipe & Acessos" },
      { to: "/configuracoes", icon: Settings, label: "Configurações CRM" },
      { to: "/missoes/configuracoes", icon: Settings, label: "Config. Missões" },
      { to: "/perfil", icon: Sparkles, label: "Meu Perfil" },
    ],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.scrollTop = Number(localStorage.getItem(SIDEBAR_SCROLL_KEY) ?? 0);
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      return next;
    });
  };

  const saveScroll = () => {
    const nav = navRef.current;
    if (nav) localStorage.setItem(SIDEBAR_SCROLL_KEY, String(nav.scrollTop));
  };

  return (
    <aside className={cn(
      "hidden lg:flex flex-col shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300",
      collapsed ? "w-20" : "w-64",
    )}>
      <div className={cn("px-4 py-5 flex items-center gap-3 border-b border-sidebar-border", collapsed && "justify-center px-3")}>
        <div className="h-10 w-10 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Kerygma Missões" width={40} height={40} className="object-contain" />
        </div>
        <div className={cn("leading-tight min-w-0", collapsed && "hidden")}>
          <p className="text-xs uppercase tracking-widest text-sidebar-foreground/60">IBK</p>
          <p className="font-semibold text-white">Kerygma Missões</p>
        </div>
        <button
          type="button"
          className={cn(
            "ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-smooth hover:bg-sidebar-accent hover:text-white",
            collapsed && "absolute left-[4.75rem] top-5 border border-sidebar-border bg-sidebar shadow-card",
          )}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          onClick={toggleCollapsed}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav ref={navRef} onScroll={saveScroll} className={cn("flex-1 overflow-y-auto px-3 py-4 space-y-6", collapsed && "px-2")}>
        {groups.map((g) => (
          <div key={g.label}>
            <p className={cn("px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-sidebar-foreground/40", collapsed && "text-center px-0")}>
              {g.label}
            </p>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = it.to === "/missoes"
                  ? pathname === it.to
                  : pathname === it.to || pathname.startsWith(`${it.to}/`);
                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      title={collapsed ? it.label : undefined}
                      onClick={saveScroll}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg text-sm transition-smooth",
                        collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5",
                        active
                          ? "bg-gradient-primary text-white shadow-elegant"
                          : "hover:bg-sidebar-accent hover:text-white",
                      )}
                    >
                      <it.icon className="h-4 w-4 shrink-0" />
                      <span className={cn("flex-1", collapsed && "sr-only")}>{it.label}</span>
                      {!collapsed && "badge" in it && it.badge ? (
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

    </aside>
  );
}
