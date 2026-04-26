import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAvatarUrl, clearAvatarCache } from "@/lib/avatarCache";

type Role = "admin" | "coordenador" | "editor" | "voluntario";
type Status = "pendente" | "ativo" | "inativo";

interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  status: Status;
  ministry_role: string | null;
  phone: string | null;
  birth_date: string | null;
  neighborhood: string | null;
  ministry_area: string | null;
  baptism_date: string | null;
  small_group: string | null;
  ebk_completed: boolean | null;
  gifts: string | null;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: Role[];
  loading: boolean;
  canEdit: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    let prof: any = p;
    if (prof?.avatar_url) {
      const signed = await getAvatarUrl(prof.avatar_url);
      if (signed) prof = { ...prof, avatar_url: signed };
    }
    setProfile(prof);
    setRoles((r ?? []).map((x: any) => x.role));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => loadProfile(s.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin");
  const canEdit =
    (profile?.status === "ativo") &&
    roles.some((r) => ["admin", "coordenador", "editor"].includes(r));

  return (
    <Ctx.Provider
      value={{
        user, session, profile, roles, loading,
        canEdit, isAdmin,
        signOut: async () => { clearAvatarCache(); await supabase.auth.signOut(); },
        refresh: async () => { if (user) await loadProfile(user.id); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth fora do AuthProvider");
  return c;
};
