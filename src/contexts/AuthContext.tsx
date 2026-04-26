import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { type Enums, type Tables } from "@/integrations/supabase/types";

type Role = Enums<"app_role">;
type Status = Enums<"member_status">;
type Profile = Tables<"profiles">;
type UserRole = Pick<Tables<"user_roles">, "role">;

const isStatus = (value: Profile["status"]): value is Status =>
  value === "pendente" || value === "ativo" || value === "inativo";

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
    let prof = p as Profile | null;
    if (prof?.avatar_url && !/^https?:\/\//.test(prof.avatar_url)) {
      const { data: signed } = await supabase.storage
        .from("avatars")
        .createSignedUrl(prof.avatar_url, 60 * 60);
      if (signed?.signedUrl) prof = { ...prof, avatar_url: signed.signedUrl };
    }
    setProfile(prof && isStatus(prof.status) ? prof : null);
    setRoles(((r ?? []) as UserRole[]).map((x) => x.role));
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
        signOut: async () => { await supabase.auth.signOut(); },
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
