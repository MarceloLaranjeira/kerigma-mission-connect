import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { showError } from "@/lib/errors";

export type EntryType =
  | "locais" | "ribeirinhas" | "nacionais" | "mundiais"
  | "convertidos" | "visitantes" | "discipulado" | "treinamento"
  | "missionarios" | "projetos" | "campanhas" | "tesouraria" | "atas" | "agenda";

export interface Entry {
  id: string;
  type: EntryType;
  title: string;
  subtitle: string | null;
  description: string | null;
  tag: string | null;
  meta: string | null;
  event_date: string | null;
  amount: number | null;
  status: string | null;
  created_at: string;
}

export function useEntries(type: EntryType) {
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("entries").select("*").eq("type", type)
      .order("created_at", { ascending: false });
    if (error) showError(error, "Não foi possível carregar os registros.");
    else setItems((data ?? []) as Entry[]);
    setLoading(false);
  }, [type]);

  useEffect(() => { load(); }, [load]);

  const create = async (payload: Partial<Entry>) => {
    const { error } = await supabase.from("entries").insert({ ...payload, type } as any);
    if (error) { showError(error, "Não foi possível criar o registro."); return false; }
    toast.success("Registro criado");
    await load(); return true;
  };

  const update = async (id: string, payload: Partial<Entry>) => {
    const { error } = await supabase.from("entries").update(payload as any).eq("id", id);
    if (error) { showError(error, "Não foi possível atualizar o registro."); return false; }
    toast.success("Registro atualizado");
    await load(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (error) { showError(error, "Não foi possível excluir o registro."); return false; }
    toast.success("Registro excluído");
    await load(); return true;
  };

  return { items, loading, create, update, remove, reload: load };
}
