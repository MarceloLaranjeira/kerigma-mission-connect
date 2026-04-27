import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { type Enums, type Tables, type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";
import { friendlyError } from "@/lib/errors";

export type CrmPerson = Tables<"crm_people">;
export type CrmStage = Tables<"crm_stages">;
export type CrmPipelineCard = Tables<"crm_pipeline_cards">;
export type CrmInteraction = Tables<"crm_interactions">;
export type CrmTask = Tables<"crm_tasks">;
export type CrmEvent = Tables<"crm_events">;
export type CrmCampaign = Tables<"crm_campaigns">;
export type CrmFinancialEntry = Tables<"crm_financial_entries">;
export type CrmSource = Tables<"crm_sources">;
export type CrmFinancialCategory = Tables<"crm_financial_categories">;
export type SimpleProfile = Pick<Tables<"profiles">, "id" | "full_name" | "email" | "avatar_url" | "ministry_role">;

export interface PersonWithRelations extends CrmPerson {
  stage: CrmStage | null;
  source: CrmSource | null;
  assigned_user: SimpleProfile | null;
  pipeline_card: CrmPipelineCard | null;
}

export interface InteractionWithPerson extends CrmInteraction {
  person: CrmPerson | null;
  responsible_user: SimpleProfile | null;
}

export interface TaskWithRelations extends CrmTask {
  person: CrmPerson | null;
  responsible_user: SimpleProfile | null;
}

export interface EventWithResponsible extends CrmEvent {
  responsible_user: SimpleProfile | null;
}

export interface CampaignWithOwner extends CrmCampaign {
  owner_user: SimpleProfile | null;
}

export interface FinancialEntryWithRelations extends CrmFinancialEntry {
  category: CrmFinancialCategory | null;
  campaign: CrmCampaign | null;
  responsible_user: SimpleProfile | null;
}

type ResourceState<T> = {
  items: T[];
  loading: boolean;
  reload: () => Promise<void>;
};

const SIMPLE_PROFILE_SELECT = "id, full_name, email, avatar_url, ministry_role";

async function loadProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select(SIMPLE_PROFILE_SELECT)
    .order("full_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SimpleProfile[];
}

async function loadStages() {
  const { data, error } = await supabase.from("crm_stages").select("*").order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CrmStage[];
}

async function loadSources() {
  const { data, error } = await supabase.from("crm_sources").select("*").eq("active", true).order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CrmSource[];
}

async function loadFinancialCategories() {
  const { data, error } = await supabase.from("crm_financial_categories").select("*").eq("active", true).order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CrmFinancialCategory[];
}

function useLoadable<T>(loader: () => Promise<T[]>, deps: unknown[] = []): ResourceState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await loader());
    } catch (error) {
      console.warn("Recurso carregado parcialmente.", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, reload };
}

export function useCrmLookups() {
  const [profiles, setProfiles] = useState<SimpleProfile[]>([]);
  const [stages, setStages] = useState<CrmStage[]>([]);
  const [sources, setSources] = useState<CrmSource[]>([]);
  const [categories, setCategories] = useState<CrmFinancialCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesData, stagesData, sourcesData, categoriesData] = await Promise.all([
        loadProfiles(),
        loadStages(),
        loadSources(),
        loadFinancialCategories(),
      ]);
      setProfiles(profilesData);
      setStages(stagesData);
      setSources(sourcesData);
      setCategories(categoriesData);
    } catch (error) {
      console.warn("Opções do CRM carregadas parcialmente.", error);
      setProfiles([]);
      setStages([]);
      setSources([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { profiles, stages, sources, categories, loading, reload };
}

export function useCrmPeople() {
  const [items, setItems] = useState<PersonWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: people, error: peopleError }, stages, profiles, sources, { data: cards, error: cardsError }] = await Promise.all([
        supabase.from("crm_people").select("*").order("created_at", { ascending: false }),
        loadStages(),
        loadProfiles(),
        loadSources(),
        supabase.from("crm_pipeline_cards").select("*").order("order_index", { ascending: true }),
      ]);
      if (peopleError) throw peopleError;
      if (cardsError) throw cardsError;

      const stageMap = new Map(stages.map((stage) => [stage.id, stage]));
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      const sourceMap = new Map(sources.map((source) => [source.id, source]));
      const cardMap = new Map((cards ?? []).map((card) => [card.person_id, card as CrmPipelineCard]));

      setItems(((people ?? []) as CrmPerson[]).map((person) => ({
        ...person,
        stage: person.current_stage_id ? stageMap.get(person.current_stage_id) ?? null : null,
        source: person.source_id ? sourceMap.get(person.source_id) ?? null : null,
        assigned_user: person.assigned_user_id ? profileMap.get(person.assigned_user_id) ?? null : null,
        pipeline_card: cardMap.get(person.id) ?? null,
      })));
    } catch (error) {
      console.warn("Pessoas carregadas parcialmente.", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = async (payload: TablesInsert<"crm_people">, pipeline?: Partial<TablesInsert<"crm_pipeline_cards">>) => {
    const { data, error } = await supabase.from("crm_people").insert(payload).select("*").single();
    if (error) {
      toast.error(friendlyError(error, "Não foi possível cadastrar a pessoa."));
      return false;
    }
    if (data?.current_stage_id) {
      const { error: cardError } = await supabase.from("crm_pipeline_cards").upsert({
        person_id: data.id,
        stage_id: data.current_stage_id,
        assigned_user_id: data.assigned_user_id,
        priority: pipeline?.priority ?? "media",
        summary: pipeline?.summary ?? null,
        next_action: pipeline?.next_action ?? null,
        next_action_at: pipeline?.next_action_at ?? null,
      }, { onConflict: "person_id" });
      if (cardError) {
        toast.error(friendlyError(cardError, "Pessoa criada, mas o card do pipeline falhou."));
      }
    }
    toast.success("Pessoa cadastrada.");
    await reload();
    return true;
  };

  const update = async (id: string, payload: TablesUpdate<"crm_people">, pipeline?: Partial<TablesUpdate<"crm_pipeline_cards">>) => {
    const { error } = await supabase.from("crm_people").update(payload).eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível atualizar a pessoa."));
      return false;
    }
    if (payload.current_stage_id || pipeline) {
      const { error: cardError } = await supabase.from("crm_pipeline_cards").upsert({
        person_id: id,
        stage_id: payload.current_stage_id ?? pipeline?.stage_id,
        assigned_user_id: payload.assigned_user_id ?? pipeline?.assigned_user_id ?? null,
        priority: pipeline?.priority ?? "media",
        summary: pipeline?.summary ?? null,
        next_action: pipeline?.next_action ?? null,
        next_action_at: pipeline?.next_action_at ?? null,
      }, { onConflict: "person_id" });
      if (cardError) {
        toast.error(friendlyError(cardError, "Pessoa atualizada, mas o card do pipeline falhou."));
        return false;
      }
    }
    toast.success("Pessoa atualizada.");
    await reload();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_people").delete().eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível excluir a pessoa."));
      return false;
    }
    toast.success("Pessoa excluída.");
    await reload();
    return true;
  };

  return { items, loading, reload, create, update, remove };
}

export function useCrmPipeline() {
  const [stages, setStages] = useState<CrmStage[]>([]);
  const [cards, setCards] = useState<(CrmPipelineCard & { person: CrmPerson | null; assigned_user: SimpleProfile | null })[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: stageData, error: stageError }, { data: cardData, error: cardError }, { data: peopleData, error: peopleError }, profiles] = await Promise.all([
        supabase.from("crm_stages").select("*").order("position", { ascending: true }),
        supabase.from("crm_pipeline_cards").select("*").order("order_index", { ascending: true }),
        supabase.from("crm_people").select("*"),
        loadProfiles(),
      ]);
      if (stageError || cardError || peopleError) throw stageError || cardError || peopleError;

      const peopleMap = new Map(((peopleData ?? []) as CrmPerson[]).map((person) => [person.id, person]));
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      setStages((stageData ?? []) as CrmStage[]);
      setCards(((cardData ?? []) as CrmPipelineCard[]).map((card) => ({
        ...card,
        person: peopleMap.get(card.person_id) ?? null,
        assigned_user: card.assigned_user_id ? profileMap.get(card.assigned_user_id) ?? null : null,
      })));
    } catch (error) {
      console.warn("Pipeline carregado parcialmente.", error);
      setStages([]);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const moveCard = async (card: CrmPipelineCard, stageId: string) => {
    const { error } = await supabase.from("crm_pipeline_cards").update({ stage_id: stageId }).eq("id", card.id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível mover o card."));
      return false;
    }
    const { error: personError } = await supabase.from("crm_people").update({ current_stage_id: stageId }).eq("id", card.person_id);
    if (personError) {
      toast.error(friendlyError(personError, "Card movido, mas a etapa da pessoa não foi sincronizada."));
      return false;
    }
    toast.success("Etapa atualizada.");
    await reload();
    return true;
  };

  const updateCard = async (id: string, payload: TablesUpdate<"crm_pipeline_cards">) => {
    const { error } = await supabase.from("crm_pipeline_cards").update(payload).eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível atualizar o card."));
      return false;
    }
    const currentCard = cards.find((card) => card.id === id);
    if (payload.stage_id && currentCard?.person_id) {
      const { error: personError } = await supabase.from("crm_people").update({ current_stage_id: payload.stage_id }).eq("id", currentCard.person_id);
      if (personError) {
        toast.error(friendlyError(personError, "Card atualizado, mas a etapa da pessoa não foi sincronizada."));
        return false;
      }
    }
    toast.success("Card atualizado.");
    await reload();
    return true;
  };

  return { stages, cards, loading, reload, moveCard, updateCard };
}

export function useCrmInteractions() {
  const [items, setItems] = useState<InteractionWithPerson[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: interactions, error }, { data: people, error: peopleError }, profiles] = await Promise.all([
        supabase.from("crm_interactions").select("*").order("happened_at", { ascending: false }),
        supabase.from("crm_people").select("*"),
        loadProfiles(),
      ]);
      if (error || peopleError) throw error || peopleError;
      const peopleMap = new Map(((people ?? []) as CrmPerson[]).map((person) => [person.id, person]));
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      setItems(((interactions ?? []) as CrmInteraction[]).map((item) => ({
        ...item,
        person: peopleMap.get(item.person_id) ?? null,
        responsible_user: item.responsible_user_id ? profileMap.get(item.responsible_user_id) ?? null : null,
      })));
    } catch (err) {
      console.warn("Atividades carregadas parcialmente.", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = async (payload: TablesInsert<"crm_interactions">) => {
    const { error } = await supabase.from("crm_interactions").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível registrar a atividade."));
      return false;
    }
    toast.success("Atividade registrada.");
    await reload();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_interactions").delete().eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível excluir a atividade."));
      return false;
    }
    toast.success("Atividade removida.");
    await reload();
    return true;
  };

  return { items, loading, reload, create, remove };
}

export function useCrmTasks() {
  const [items, setItems] = useState<TaskWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: tasks, error }, { data: people, error: peopleError }, profiles] = await Promise.all([
        supabase.from("crm_tasks").select("*").order("due_at", { ascending: true, nullsFirst: false }),
        supabase.from("crm_people").select("*"),
        loadProfiles(),
      ]);
      if (error || peopleError) throw error || peopleError;
      const peopleMap = new Map(((people ?? []) as CrmPerson[]).map((person) => [person.id, person]));
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      setItems(((tasks ?? []) as CrmTask[]).map((task) => ({
        ...task,
        person: task.person_id ? peopleMap.get(task.person_id) ?? null : null,
        responsible_user: task.responsible_user_id ? profileMap.get(task.responsible_user_id) ?? null : null,
      })));
    } catch (err) {
      console.warn("Tarefas carregadas parcialmente.", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = async (payload: TablesInsert<"crm_tasks">) => {
    const { error } = await supabase.from("crm_tasks").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível criar a tarefa."));
      return false;
    }
    toast.success("Tarefa criada.");
    await reload();
    return true;
  };

  const update = async (id: string, payload: TablesUpdate<"crm_tasks">) => {
    const { error } = await supabase.from("crm_tasks").update(payload).eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível atualizar a tarefa."));
      return false;
    }
    toast.success("Tarefa atualizada.");
    await reload();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_tasks").delete().eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível excluir a tarefa."));
      return false;
    }
    toast.success("Tarefa removida.");
    await reload();
    return true;
  };

  return { items, loading, reload, create, update, remove };
}

export function useCrmEvents() {
  const [items, setItems] = useState<EventWithResponsible[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: events, error }, profiles] = await Promise.all([
        supabase.from("crm_events").select("*").order("starts_at", { ascending: true, nullsFirst: false }),
        loadProfiles(),
      ]);
      if (error) throw error;
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      setItems(((events ?? []) as CrmEvent[]).map((event) => ({
        ...event,
        responsible_user: event.responsible_user_id ? profileMap.get(event.responsible_user_id) ?? null : null,
      })));
    } catch (err) {
      console.warn("Agenda carregada parcialmente.", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = async (payload: TablesInsert<"crm_events">) => {
    const { error } = await supabase.from("crm_events").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível criar o evento."));
      return false;
    }
    toast.success("Evento criado.");
    await reload();
    return true;
  };

  const update = async (id: string, payload: TablesUpdate<"crm_events">) => {
    const { error } = await supabase.from("crm_events").update(payload).eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível atualizar o evento."));
      return false;
    }
    toast.success("Evento atualizado.");
    await reload();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_events").delete().eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível excluir o evento."));
      return false;
    }
    toast.success("Evento removido.");
    await reload();
    return true;
  };

  return { items, loading, reload, create, update, remove };
}

export function useCrmCampaigns() {
  const [items, setItems] = useState<CampaignWithOwner[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: campaigns, error }, profiles] = await Promise.all([
        supabase.from("crm_campaigns").select("*").order("created_at", { ascending: false }),
        loadProfiles(),
      ]);
      if (error) {
        console.warn("Campanhas carregadas parcialmente.", error);
        setItems([]);
        return;
      }
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      setItems(((campaigns ?? []) as CrmCampaign[]).map((campaign) => ({
        ...campaign,
        owner_user: campaign.owner_user_id ? profileMap.get(campaign.owner_user_id) ?? null : null,
      })));
    } catch (err) {
      console.warn("Não foi possível carregar as campanhas.", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = async (payload: TablesInsert<"crm_campaigns">) => {
    const { error } = await supabase.from("crm_campaigns").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível criar a campanha."));
      return false;
    }
    toast.success("Campanha criada.");
    await reload();
    return true;
  };

  const update = async (id: string, payload: TablesUpdate<"crm_campaigns">) => {
    const { error } = await supabase.from("crm_campaigns").update(payload).eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível atualizar a campanha."));
      return false;
    }
    toast.success("Campanha atualizada.");
    await reload();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_campaigns").delete().eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível excluir a campanha."));
      return false;
    }
    toast.success("Campanha removida.");
    await reload();
    return true;
  };

  return { items, loading, reload, create, update, remove };
}

export function useCrmFinancial() {
  const [items, setItems] = useState<FinancialEntryWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [entriesResult, categoriesResult, campaignsResult, profilesResult] = await Promise.allSettled([
      supabase.from("crm_financial_entries").select("*").order("entry_date", { ascending: false }),
      loadFinancialCategories(),
      supabase.from("crm_campaigns").select("*"),
      loadProfiles(),
    ]);
    try {
      const entries = entriesResult.status === "fulfilled" && !entriesResult.value.error
        ? (entriesResult.value.data ?? []) as CrmFinancialEntry[]
        : [];
      const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
      const campaigns = campaignsResult.status === "fulfilled" && !campaignsResult.value.error
        ? (campaignsResult.value.data ?? []) as CrmCampaign[]
        : [];
      const profiles = profilesResult.status === "fulfilled" ? profilesResult.value : [];
      if (entriesResult.status === "rejected" || (entriesResult.status === "fulfilled" && entriesResult.value.error)) {
        console.warn("Lançamentos financeiros carregados parcialmente.", entriesResult.status === "fulfilled" ? entriesResult.value.error : entriesResult.reason);
      }
      if (campaignsResult.status === "rejected" || (campaignsResult.status === "fulfilled" && campaignsResult.value.error)) {
        console.warn("Campanhas do financeiro carregadas parcialmente.", campaignsResult.status === "fulfilled" ? campaignsResult.value.error : campaignsResult.reason);
      }
      if (categoriesResult.status === "rejected") console.warn("Categorias financeiras carregadas parcialmente.", categoriesResult.reason);
      if (profilesResult.status === "rejected") console.warn("Responsáveis do financeiro carregados parcialmente.", profilesResult.reason);
      const categoryMap = new Map(categories.map((category) => [category.id, category]));
      const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign]));
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
      setItems(entries.map((entry) => ({
        ...entry,
        category: entry.category_id ? categoryMap.get(entry.category_id) ?? null : null,
        campaign: entry.campaign_id ? campaignMap.get(entry.campaign_id) ?? null : null,
        responsible_user: entry.responsible_user_id ? profileMap.get(entry.responsible_user_id) ?? null : null,
      })));
    } catch (err) {
      console.warn("Não foi possível carregar o financeiro.", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = async (payload: TablesInsert<"crm_financial_entries">) => {
    const { error } = await supabase.from("crm_financial_entries").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível registrar o lançamento."));
      return false;
    }
    toast.success("Lançamento registrado.");
    await reload();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_financial_entries").delete().eq("id", id);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível excluir o lançamento."));
      return false;
    }
    toast.success("Lançamento removido.");
    await reload();
    return true;
  };

  return { items, loading, reload, create, remove };
}

export function useCrmDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    people: [] as CrmPerson[],
    stages: [] as CrmStage[],
    cards: [] as CrmPipelineCard[],
    tasks: [] as CrmTask[],
    interactions: [] as CrmInteraction[],
    events: [] as CrmEvent[],
    campaigns: [] as CrmCampaign[],
    financial: [] as CrmFinancialEntry[],
  });

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [
        peopleResult,
        stagesResult,
        cardsResult,
        tasksResult,
        interactionsResult,
        eventsResult,
        campaignsResult,
        financialResult,
      ] = await Promise.all([
        supabase.from("crm_people").select("*"),
        supabase.from("crm_stages").select("*").order("position", { ascending: true }),
        supabase.from("crm_pipeline_cards").select("*"),
        supabase.from("crm_tasks").select("*"),
        supabase.from("crm_interactions").select("*").order("happened_at", { ascending: false }).limit(8),
        supabase.from("crm_events").select("*").order("starts_at", { ascending: true, nullsFirst: false }).limit(8),
        supabase.from("crm_campaigns").select("*"),
        supabase.from("crm_financial_entries").select("*").order("entry_date", { ascending: false }).limit(24),
      ]);
      const errors = [
        peopleResult.error,
        stagesResult.error,
        cardsResult.error,
        tasksResult.error,
        interactionsResult.error,
        eventsResult.error,
        campaignsResult.error,
        financialResult.error,
      ].filter(Boolean);
      if (errors.length > 0) {
        console.warn("Dashboard carregado parcialmente.", errors);
      }
      setData({
        people: (peopleResult.data ?? []) as CrmPerson[],
        stages: (stagesResult.data ?? []) as CrmStage[],
        cards: (cardsResult.data ?? []) as CrmPipelineCard[],
        tasks: (tasksResult.data ?? []) as CrmTask[],
        interactions: (interactionsResult.data ?? []) as CrmInteraction[],
        events: (eventsResult.data ?? []) as CrmEvent[],
        campaigns: (campaignsResult.data ?? []) as CrmCampaign[],
        financial: (financialResult.data ?? []) as CrmFinancialEntry[],
      });
    } catch (error) {
      console.warn("Não foi possível carregar o dashboard.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const metrics = useMemo(() => {
    const pipelineMap = new Map(data.stages.map((stage) => [stage.id, stage]));
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthFinancial = data.financial.filter((entry) => {
      const entryDate = new Date(entry.entry_date);
      return entryDate >= monthStart && entryDate < monthEnd;
    });
    const upcomingTasks = data.tasks.filter((task) => isTaskOpen(task.status)).length;
    const overdueTasks = data.tasks.filter((task) => task.due_at && isTaskOpen(task.status) && new Date(task.due_at) < now).length;
    const nextActionsDue = data.cards.filter((card) => card.next_action_at && new Date(card.next_action_at) < now).length;
    const peopleInDiscipleship = data.people.filter((person) => person.lifecycle_status === "discipulado").length;
    const activeCampaigns = data.campaigns.filter((campaign) => campaign.status === "ativa").length;
    const visitors = data.people.filter((person) => person.lifecycle_status === "visitante").length;
    const monthIncome = monthFinancial
      .filter((entry) => entry.type === "entrada")
      .reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
    const monthExpense = monthFinancial
      .filter((entry) => entry.type === "saida")
      .reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
    const pipelineSummary = data.cards.reduce<Record<string, number>>((acc, card) => {
      const stage = pipelineMap.get(card.stage_id);
      if (stage) acc[stage.name] = (acc[stage.name] ?? 0) + 1;
      return acc;
    }, {});

    return {
      upcomingTasks,
      peopleInDiscipleship,
      activeCampaigns,
      visitors,
      overdueTasks,
      nextActionsDue,
      monthIncome,
      monthExpense,
      pipelineSummary,
    };
  }, [data]);

  return { ...data, metrics, loading, reload };
}

export function useCrmSettings() {
  const stages = useLoadable(loadStages, []);
  const sources = useLoadable(loadSources, []);
  const categories = useLoadable(loadFinancialCategories, []);

  const createStage = async (payload: TablesInsert<"crm_stages">) => {
    const { error } = await supabase.from("crm_stages").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível criar a etapa."));
      return false;
    }
    toast.success("Etapa criada.");
    await stages.reload();
    return true;
  };

  const createSource = async (payload: TablesInsert<"crm_sources">) => {
    const { error } = await supabase.from("crm_sources").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível criar a origem."));
      return false;
    }
    toast.success("Origem criada.");
    await sources.reload();
    return true;
  };

  const createCategory = async (payload: TablesInsert<"crm_financial_categories">) => {
    const { error } = await supabase.from("crm_financial_categories").insert(payload);
    if (error) {
      toast.error(friendlyError(error, "Não foi possível criar a categoria."));
      return false;
    }
    toast.success("Categoria criada.");
    await categories.reload();
    return true;
  };

  return { stages, sources, categories, createStage, createSource, createCategory };
}

export type LookupOption = { id: string; label: string };

export function useLookupMaps() {
  const { profiles, stages, sources, categories, loading, reload } = useCrmLookups();
  return {
    loading,
    reload,
    profiles,
    stages,
    sources,
    categories,
    profileOptions: profiles.map((profile) => ({ id: profile.id, label: profile.full_name })),
    stageOptions: stages.map((stage) => ({ id: stage.id, label: stage.name })),
    sourceOptions: sources.map((source) => ({ id: source.id, label: source.name })),
    categoryOptions: categories.map((category) => ({ id: category.id, label: category.name })),
  };
}

export function nextStageId(stages: CrmStage[], currentStageId: string, direction: "prev" | "next") {
  const index = stages.findIndex((stage) => stage.id === currentStageId);
  if (index < 0) return null;
  const nextIndex = direction === "prev" ? index - 1 : index + 1;
  return stages[nextIndex]?.id ?? null;
}

export function stageLabelById(stages: CrmStage[], stageId: string | null | undefined) {
  return stages.find((stage) => stage.id === stageId)?.name ?? "Sem etapa";
}

export function isTaskOpen(status: Enums<"crm_task_status">) {
  return status === "aberta" || status === "em_andamento";
}
