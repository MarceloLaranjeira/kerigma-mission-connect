import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Enums, type Tables, type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";
import { friendlyError } from "@/lib/errors";

export type EntryType = Enums<"entry_type">;
export type EntryPayload = Omit<TablesInsert<"entries">, "type">;
export type EntryUpdate = Omit<TablesUpdate<"entries">, "type">;

export type Entry = Tables<"entries">;

export function useEntries(type: EntryType) {
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("entries").select("*").eq("type", type)
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Registros missionários carregados parcialmente.", error);
      setItems([]);
    } else {
      setItems((data ?? []) as Entry[]);
    }
    setLoading(false);
  }, [type]);

  useEffect(() => { load(); }, [load]);

  const create = async (payload: EntryPayload) => {
    const { error } = await supabase.from("entries").insert({ ...payload, type });
    if (error) { toast.error(friendlyError(error, "Não foi possível criar o registro missionário.")); return false; }
    toast.success("Registro criado");
    await load(); return true;
  };

  const update = async (id: string, payload: EntryUpdate) => {
    const { error } = await supabase.from("entries").update(payload).eq("id", id);
    if (error) { toast.error(friendlyError(error, "Não foi possível atualizar o registro missionário.")); return false; }
    toast.success("Registro atualizado");
    await load(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (error) { toast.error(friendlyError(error, "Não foi possível excluir o registro missionário.")); return false; }
    toast.success("Registro excluído");
    await load(); return true;
  };

  return { items, loading, create, update, remove, reload: load };
}
