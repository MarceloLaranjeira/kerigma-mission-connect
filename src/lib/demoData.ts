import { supabase } from "@/integrations/supabase/client";
import { type Enums, type Tables, type TablesInsert } from "@/integrations/supabase/types";

const DEMO_MARKER = "Demonstração Kerygma";

type SeedSummary = {
  skipped: boolean;
  people: number;
  pipelineCards: number;
  tasks: number;
  interactions: number;
  events: number;
  campaigns: number;
  financialEntries: number;
  missionEntries: number;
};

const sourceSeed: TablesInsert<"crm_sources">[] = [
  { name: "Demo - Culto de Missões", kind: "presencial" },
  { name: "Demo - Ação Ribeirinha", kind: "acao" },
  { name: "Demo - Indicação de Líder", kind: "relacionamento" },
  { name: "Demo - Formulário Online", kind: "digital" },
];

const categorySeed: TablesInsert<"crm_financial_categories">[] = [
  { name: "Demo - Ofertas Missionárias", color: "#2563eb", sort_order: 20 },
  { name: "Demo - Logística de Viagem", color: "#14b8a6", sort_order: 21 },
  { name: "Demo - Treinamentos", color: "#f59e0b", sort_order: 22 },
  { name: "Demo - Apoio Social", color: "#8b5cf6", sort_order: 23 },
];

const fallbackStages: TablesInsert<"crm_stages">[] = [
  { name: "Visitante", slug: "visitante", position: 1, color: "#2563eb" },
  { name: "Primeiro Contato", slug: "primeiro-contato", position: 2, color: "#0ea5e9" },
  { name: "Acompanhamento", slug: "acompanhamento", position: 3, color: "#f59e0b" },
  { name: "Discipulado", slug: "discipulado", position: 4, color: "#14b8a6" },
  { name: "Integração", slug: "integracao", position: 5, color: "#22c55e" },
  { name: "Membro", slug: "membro", position: 6, color: "#16a34a", is_closed: true },
];

const peopleSeed: Array<{
  full_name: string;
  preferred_name: string;
  front: Enums<"crm_front">;
  lifecycle_status: Enums<"crm_lifecycle_status">;
  source: string;
  stageSlug: string;
  neighborhood: string;
  priority: Enums<"crm_priority">;
  nextActionOffset: number;
  summary: string;
  next_action: string;
}> = [
  {
    full_name: "Ana Clara Menezes",
    preferred_name: "Ana",
    front: "locais",
    lifecycle_status: "visitante",
    source: "Demo - Culto de Missões",
    stageSlug: "visitante",
    neighborhood: "Cidade Nova",
    priority: "media",
    nextActionOffset: 2,
    summary: "Visitou o culto missionário e pediu contato sobre GC.",
    next_action: "Enviar mensagem de acolhimento e convite para célula.",
  },
  {
    full_name: "Bruno Carvalho Santos",
    preferred_name: "Bruno",
    front: "locais",
    lifecycle_status: "primeiro_contato",
    source: "Demo - Indicação de Líder",
    stageSlug: "primeiro-contato",
    neighborhood: "Adrianópolis",
    priority: "alta",
    nextActionOffset: -1,
    summary: "Recebeu primeira visita, mas ainda não respondeu ao convite.",
    next_action: "Ligar e reagendar encontro pastoral.",
  },
  {
    full_name: "Camila Nascimento Lima",
    preferred_name: "Camila",
    front: "discipulado",
    lifecycle_status: "discipulado",
    source: "Demo - Culto de Missões",
    stageSlug: "discipulado",
    neighborhood: "Flores",
    priority: "media",
    nextActionOffset: 5,
    summary: "Está no módulo 2 do discipulado com boa frequência.",
    next_action: "Conferir presença e material da próxima aula.",
  },
  {
    full_name: "Daniel Rocha Almeida",
    preferred_name: "Daniel",
    front: "ribeirinhas",
    lifecycle_status: "voluntario",
    source: "Demo - Ação Ribeirinha",
    stageSlug: "integracao",
    neighborhood: "Compensa",
    priority: "urgente",
    nextActionOffset: 1,
    summary: "Voluntário confirmado para viagem ribeirinha, pendente documentação.",
    next_action: "Validar documentos e autorização de viagem.",
  },
  {
    full_name: "Elisa Martins Oliveira",
    preferred_name: "Elisa",
    front: "mundiais",
    lifecycle_status: "missionario",
    source: "Demo - Indicação de Líder",
    stageSlug: "membro",
    neighborhood: "Ponta Negra",
    priority: "alta",
    nextActionOffset: 12,
    summary: "Missionária em preparação para parceria internacional.",
    next_action: "Revisar carta de apresentação e plano de sustento.",
  },
  {
    full_name: "Felipe Costa Barbosa",
    preferred_name: "Felipe",
    front: "treinamento",
    lifecycle_status: "acompanhamento",
    source: "Demo - Formulário Online",
    stageSlug: "acompanhamento",
    neighborhood: "Parque 10",
    priority: "baixa",
    nextActionOffset: 9,
    summary: "Interessado em treinamento de evangelismo urbano.",
    next_action: "Enviar agenda do próximo intensivo.",
  },
  {
    full_name: "Gabriela Souza Pires",
    preferred_name: "Gabi",
    front: "nacionais",
    lifecycle_status: "membro",
    source: "Demo - Indicação de Líder",
    stageSlug: "membro",
    neighborhood: "Aleixo",
    priority: "media",
    nextActionOffset: 18,
    summary: "Líder de intercessão para projeto nacional.",
    next_action: "Confirmar escala mensal de oração.",
  },
  {
    full_name: "Henrique Alves Farias",
    preferred_name: "Henrique",
    front: "tesouraria",
    lifecycle_status: "voluntario",
    source: "Demo - Culto de Missões",
    stageSlug: "integracao",
    neighborhood: "Centro",
    priority: "alta",
    nextActionOffset: 3,
    summary: "Apoia conferência de ofertas e prestação de contas.",
    next_action: "Conferir conciliação da campanha ribeirinha.",
  },
  {
    full_name: "Isabela Ferreira Torres",
    preferred_name: "Isa",
    front: "ribeirinhas",
    lifecycle_status: "primeiro_contato",
    source: "Demo - Ação Ribeirinha",
    stageSlug: "primeiro-contato",
    neighborhood: "Comunidade São Pedro",
    priority: "urgente",
    nextActionOffset: -3,
    summary: "Decisão registrada na comunidade, precisa de acompanhamento remoto.",
    next_action: "Contato com liderança local para primeira aula.",
  },
  {
    full_name: "João Pedro Azevedo",
    preferred_name: "João",
    front: "geral",
    lifecycle_status: "inativo",
    source: "Demo - Formulário Online",
    stageSlug: "acompanhamento",
    neighborhood: "Japiim",
    priority: "baixa",
    nextActionOffset: 20,
    summary: "Cadastro inativo mantido para cenário de reativação.",
    next_action: "Avaliar se ainda deseja receber contato.",
  },
];

const campaignSeed: Array<Omit<TablesInsert<"crm_campaigns">, "owner_user_id"> & { key: string }> = [
  {
    key: "ribeirinha",
    title: "[Demo] Viagem Ribeirinha Maio",
    description: `${DEMO_MARKER}: campanha ativa para logística, kits e acompanhamento pós-viagem.`,
    status: "ativa",
    front: "ribeirinhas",
    goal_amount: 18000,
    starts_at: addDays(4),
    ends_at: addDays(21),
  },
  {
    key: "treinamento",
    title: "[Demo] Escola de Evangelismo",
    description: `${DEMO_MARKER}: treinamento em planejamento com inscrições abertas.`,
    status: "rascunho",
    front: "treinamento",
    goal_amount: 6200,
    starts_at: addDays(15),
    ends_at: addDays(45),
  },
  {
    key: "mundial",
    title: "[Demo] Sustento Missionário Internacional",
    description: `${DEMO_MARKER}: campanha pausada aguardando atualização de orçamento.`,
    status: "pausada",
    front: "mundiais",
    goal_amount: 26000,
    starts_at: addDays(-18),
    ends_at: addDays(60),
  },
  {
    key: "local",
    title: "[Demo] Impacto Bairro Novo",
    description: `${DEMO_MARKER}: campanha concluída para cenário histórico.`,
    status: "concluida",
    front: "locais",
    goal_amount: 8400,
    starts_at: addDays(-55),
    ends_at: addDays(-8),
  },
  {
    key: "nacional",
    title: "[Demo] Base Nacional Cancelada",
    description: `${DEMO_MARKER}: exemplo de campanha cancelada para filtros e relatórios.`,
    status: "cancelada",
    front: "nacionais",
    goal_amount: 12000,
    starts_at: addDays(-30),
    ends_at: addDays(30),
  },
];

const eventSeed: Array<Omit<TablesInsert<"crm_events">, "responsible_user_id"> & { campaignKey?: string }> = [
  { title: "[Demo] Visita pastoral pós-culto", description: DEMO_MARKER, event_type: "visita", front: "locais", starts_at: addDays(2), ends_at: addDays(2, 2), location: "Bairro Cidade Nova" },
  { title: "[Demo] Treinamento de evangelismo", description: DEMO_MARKER, event_type: "treinamento", front: "treinamento", starts_at: addDays(8), ends_at: addDays(8, 3), location: "Sala de capacitação", campaignKey: "treinamento" },
  { title: "[Demo] Mobilização da campanha ribeirinha", description: DEMO_MARKER, event_type: "campanha", front: "ribeirinhas", starts_at: addDays(5), ends_at: addDays(5, 2), location: "Templo principal", campaignKey: "ribeirinha" },
  { title: "[Demo] Culto de envio", description: DEMO_MARKER, event_type: "culto", front: "mundiais", starts_at: addDays(12), ends_at: addDays(12, 2), location: "Auditório IBK", campaignKey: "mundial" },
  { title: "[Demo] Reunião de líderes missionários", description: DEMO_MARKER, event_type: "reuniao", front: "geral", starts_at: addDays(1), ends_at: addDays(1, 1), location: "Sala pastoral" },
  { title: "[Demo] Viagem comunidade São Pedro", description: DEMO_MARKER, event_type: "viagem", front: "ribeirinhas", starts_at: addDays(18), ends_at: addDays(20), location: "Rio Negro", campaignKey: "ribeirinha" },
  { title: "[Demo] Evangelismo praça central", description: DEMO_MARKER, event_type: "evangelismo", front: "locais", starts_at: addDays(-3), ends_at: addDays(-3, 2), location: "Praça do bairro", campaignKey: "local" },
];

const interactionTypes: Enums<"crm_interaction_type">[] = ["ligacao", "visita", "oracao", "reuniao", "culto", "mensagem", "decisao", "discipulado", "nota"];
const entryTypes: Enums<"entry_type">[] = [
  "locais",
  "ribeirinhas",
  "nacionais",
  "mundiais",
  "convertidos",
  "visitantes",
  "discipulado",
  "treinamento",
  "missionarios",
  "projetos",
  "campanhas",
  "tesouraria",
  "atas",
  "agenda",
  "equipe",
];

export async function seedDemoData(userId: string): Promise<SeedSummary> {
  const { count, error: countError } = await supabase
    .from("crm_people")
    .select("id", { count: "exact", head: true })
    .ilike("notes", `%${DEMO_MARKER}%`);
  if (countError) throw countError;
  if ((count ?? 0) > 0) return emptySummary(true);

  const [sources, categories, stages] = await Promise.all([
    ensureSources(),
    ensureCategories(),
    ensureStages(),
  ]);
  const sourceByName = new Map(sources.map((source) => [source.name, source.id]));
  const categoryByName = new Map(categories.map((category) => [category.name, category.id]));
  const stageBySlug = new Map(stages.map((stage) => [stage.slug, stage.id]));

  const peoplePayload: TablesInsert<"crm_people">[] = peopleSeed.map((person, index) => ({
    full_name: person.full_name,
    preferred_name: person.preferred_name,
    email: `${slugify(person.preferred_name)}.demo@kerygma.local`,
    phone: `(92) 9${String(83000000 + index * 973).slice(0, 8)}`,
    whatsapp: `(92) 9${String(92000000 + index * 751).slice(0, 8)}`,
    birth_date: dateOnly(addDays(-9000 - index * 430)),
    marital_status: index % 3 === 0 ? "Casado(a)" : index % 3 === 1 ? "Solteiro(a)" : "Não informado",
    address_line: `Rua Demo ${index + 1}, ${120 + index}`,
    neighborhood: person.neighborhood,
    city: "Manaus",
    state: "AM",
    source_id: sourceByName.get(person.source) ?? null,
    current_stage_id: stageBySlug.get(person.stageSlug) ?? null,
    lifecycle_status: person.lifecycle_status,
    assigned_user_id: userId,
    front: person.front,
    is_active: person.lifecycle_status !== "inativo",
    notes: `${DEMO_MARKER}: cenário ${index + 1}. Pode editar livremente este cadastro.`,
  }));

  const { data: createdPeople, error: peopleError } = await supabase
    .from("crm_people")
    .insert(peoplePayload)
    .select("*");
  if (peopleError) throw peopleError;
  const people = (createdPeople ?? []) as Tables<"crm_people">[];

  const cardsPayload: TablesInsert<"crm_pipeline_cards">[] = people.map((person, index) => ({
    person_id: person.id,
    stage_id: person.current_stage_id ?? stageBySlug.get("visitante") ?? stages[0].id,
    assigned_user_id: userId,
    priority: peopleSeed[index].priority,
    summary: peopleSeed[index].summary,
    next_action: peopleSeed[index].next_action,
    next_action_at: addDays(peopleSeed[index].nextActionOffset),
    order_index: index,
    created_by: userId,
  }));
  const { error: cardError } = await supabase.from("crm_pipeline_cards").insert(cardsPayload);
  if (cardError) throw cardError;

  const { data: createdCampaigns, error: campaignError } = await supabase
    .from("crm_campaigns")
    .insert(campaignSeed.map(({ key: _key, ...campaign }) => ({ ...campaign, owner_user_id: userId })))
    .select("*");
  if (campaignError) throw campaignError;
  const campaigns = (createdCampaigns ?? []) as Tables<"crm_campaigns">[];
  const campaignByKey = new Map(campaignSeed.map((campaign, index) => [campaign.key, campaigns[index]?.id]));

  const { data: createdEvents, error: eventError } = await supabase
    .from("crm_events")
    .insert(eventSeed.map(({ campaignKey: _campaignKey, ...event }) => ({ ...event, responsible_user_id: userId })))
    .select("*");
  if (eventError) throw eventError;
  const events = (createdEvents ?? []) as Tables<"crm_events">[];

  const tasksPayload: TablesInsert<"crm_tasks">[] = [
    task("Ligar para visitante que faltou", "aberta", "alta", -2, people[1]?.id, null, null, userId),
    task("Confirmar documentação da equipe ribeirinha", "em_andamento", "urgente", 1, people[3]?.id, null, campaignByKey.get("ribeirinha") ?? null, userId),
    task("Enviar material do discipulado", "concluida", "media", -5, people[2]?.id, events[1]?.id, null, userId),
    task("Revisar orçamento internacional", "cancelada", "baixa", 10, people[4]?.id, null, campaignByKey.get("mundial") ?? null, userId),
    task("Agendar visita de reativação", "aberta", "media", 7, people[9]?.id, null, null, userId),
  ];
  const { data: createdTasks, error: taskError } = await supabase.from("crm_tasks").insert(tasksPayload).select("*");
  if (taskError) throw taskError;
  const tasks = (createdTasks ?? []) as Tables<"crm_tasks">[];

  const interactionsPayload: TablesInsert<"crm_interactions">[] = interactionTypes.map((type, index) => ({
    person_id: people[index % people.length].id,
    type,
    title: `[Demo] ${interactionTitle(type)}`,
    description: `${DEMO_MARKER}: interação fictícia para ilustrar o tipo ${type}.`,
    happened_at: addDays(-index * 2),
    responsible_user_id: userId,
    linked_task_id: tasks[index % tasks.length]?.id ?? null,
    linked_event_id: events[index % events.length]?.id ?? null,
    linked_campaign_id: campaigns[index % campaigns.length]?.id ?? null,
  }));
  const { error: interactionError } = await supabase.from("crm_interactions").insert(interactionsPayload);
  if (interactionError) throw interactionError;

  const financialPayload: TablesInsert<"crm_financial_entries">[] = [
    financial("entrada", 5400, -20, "Oferta missionária recebida", "Demo - Ofertas Missionárias", campaignByKey.get("ribeirinha") ?? null, userId),
    financial("saida", 2120, -16, "Compra de medicamentos e kits", "Demo - Apoio Social", campaignByKey.get("ribeirinha") ?? null, userId),
    financial("entrada", 12800, -8, "Compromissos de sustento internacional", "Demo - Ofertas Missionárias", campaignByKey.get("mundial") ?? null, userId),
    financial("saida", 3400, -3, "Reserva de transporte fluvial", "Demo - Logística de Viagem", campaignByKey.get("ribeirinha") ?? null, userId),
    financial("entrada", 1950, 0, "Inscrições de treinamento", "Demo - Treinamentos", campaignByKey.get("treinamento") ?? null, userId),
    financial("saida", 780, 4, "Material didático previsto", "Demo - Treinamentos", campaignByKey.get("treinamento") ?? null, userId),
  ].map(({ categoryName, ...entry }) => ({ ...entry, category_id: categoryByName.get(categoryName) ?? null }));
  const { error: financialError } = await supabase.from("crm_financial_entries").insert(financialPayload);
  if (financialError) throw financialError;

  const missionEntriesPayload: TablesInsert<"entries">[] = entryTypes.map((type, index) => ({
    type,
    title: `[Demo] ${entryTitle(type)}`,
    subtitle: entrySubtitle(type),
    description: `${DEMO_MARKER}: registro fictício editável para ilustrar o módulo ${type}.`,
    tag: index % 4 === 0 ? "Ativo" : index % 4 === 1 ? "Programado" : index % 4 === 2 ? "Concluído" : "Em acompanhamento",
    meta: index % 3 === 0 ? "Próxima ação definida" : index % 3 === 1 ? "Equipe vinculada" : "Orçamento em revisão",
    event_date: dateOnly(addDays(index - 6)),
    amount: index % 2 === 0 ? 450 + index * 190 : null,
    status: index % 4 === 2 ? "concluido" : "ativo",
    created_by: userId,
  }));
  const { error: entryError } = await supabase.from("entries").insert(missionEntriesPayload);
  if (entryError) throw entryError;

  await linkCampaigns(campaigns, events, people, campaignByKey);

  return {
    skipped: false,
    people: peoplePayload.length,
    pipelineCards: cardsPayload.length,
    tasks: tasksPayload.length,
    interactions: interactionsPayload.length,
    events: eventSeed.length,
    campaigns: campaignSeed.length,
    financialEntries: financialPayload.length,
    missionEntries: missionEntriesPayload.length,
  };
}

async function ensureSources() {
  const { data, error } = await supabase
    .from("crm_sources")
    .upsert(sourceSeed, { onConflict: "name" })
    .select("*");
  if (error) throw error;
  return (data ?? []) as Tables<"crm_sources">[];
}

async function ensureCategories() {
  const { data, error } = await supabase
    .from("crm_financial_categories")
    .upsert(categorySeed, { onConflict: "name" })
    .select("*");
  if (error) throw error;
  return (data ?? []) as Tables<"crm_financial_categories">[];
}

async function ensureStages() {
  const { data, error } = await supabase
    .from("crm_stages")
    .upsert(fallbackStages, { onConflict: "slug" })
    .select("*");
  if (error) throw error;
  return (data ?? []) as Tables<"crm_stages">[];
}

async function linkCampaigns(
  campaigns: Tables<"crm_campaigns">[],
  events: Tables<"crm_events">[],
  people: Tables<"crm_people">[],
  campaignByKey: Map<string, string | undefined>,
) {
  const campaignPeople: TablesInsert<"crm_campaign_people">[] = campaigns.flatMap((campaign, index) =>
    people
      .filter((person) => person.front === campaign.front || index % 2 === 0)
      .slice(0, 3)
      .map((person) => ({ campaign_id: campaign.id, person_id: person.id })),
  );
  const campaignEvents: TablesInsert<"crm_campaign_events">[] = eventSeed
    .map((event, index) => {
      const campaignId = event.campaignKey ? campaignByKey.get(event.campaignKey) : null;
      const eventId = events[index]?.id;
      return campaignId && eventId ? { campaign_id: campaignId, event_id: eventId } : null;
    })
    .filter(Boolean) as TablesInsert<"crm_campaign_events">[];

  const [peopleResult, eventsResult] = await Promise.all([
    campaignPeople.length > 0 ? supabase.from("crm_campaign_people").upsert(campaignPeople) : Promise.resolve({ error: null }),
    campaignEvents.length > 0 ? supabase.from("crm_campaign_events").upsert(campaignEvents) : Promise.resolve({ error: null }),
  ]);
  if (peopleResult.error) throw peopleResult.error;
  if (eventsResult.error) throw eventsResult.error;
}

function task(
  title: string,
  status: Enums<"crm_task_status">,
  priority: Enums<"crm_priority">,
  dueOffset: number,
  personId: string | null | undefined,
  eventId: string | null,
  campaignId: string | null,
  userId: string,
): TablesInsert<"crm_tasks"> {
  return {
    title: `[Demo] ${title}`,
    description: `${DEMO_MARKER}: tarefa fictícia editável.`,
    status,
    priority,
    due_at: addDays(dueOffset),
    person_id: personId ?? null,
    linked_event_id: eventId,
    linked_campaign_id: campaignId,
    responsible_user_id: userId,
    created_by: userId,
  };
}

function financial(
  type: Enums<"crm_financial_type">,
  amount: number,
  offset: number,
  description: string,
  categoryName: string,
  campaignId: string | null,
  userId: string,
): TablesInsert<"crm_financial_entries"> & { categoryName: string } {
  return {
    type,
    amount,
    entry_date: dateOnly(addDays(offset)),
    description: `[Demo] ${description}`,
    categoryName,
    campaign_id: campaignId,
    responsible_user_id: userId,
    created_by: userId,
  };
}

function interactionTitle(type: Enums<"crm_interaction_type">) {
  const labels: Record<Enums<"crm_interaction_type">, string> = {
    ligacao: "Ligação de acompanhamento",
    visita: "Visita registrada",
    oracao: "Pedido de oração acompanhado",
    reuniao: "Reunião com liderança",
    culto: "Presença no culto",
    mensagem: "Mensagem enviada",
    decisao: "Decisão por Cristo",
    discipulado: "Aula de discipulado",
    nota: "Nota pastoral",
  };
  return labels[type];
}

function entryTitle(type: Enums<"entry_type">) {
  const labels: Record<Enums<"entry_type">, string> = {
    locais: "Ação local bairro Novo",
    ribeirinhas: "Base ribeirinha São Pedro",
    nacionais: "Parceria sertão brasileiro",
    mundiais: "Carta missionária internacional",
    convertidos: "Novos convertidos acompanhados",
    visitantes: "Visitantes do culto missionário",
    discipulado: "Turma discipulado módulo 2",
    treinamento: "Treinamento evangelismo urbano",
    missionarios: "Missionário em preparação",
    projetos: "Projeto viagem de maio",
    campanhas: "Campanha kits missionários",
    tesouraria: "Prestação parcial de contas",
    atas: "Ata reunião diretoria missionária",
    agenda: "Agenda integrada de visitas",
    equipe: "Escala equipe de apoio",
  };
  return labels[type];
}

function entrySubtitle(type: Enums<"entry_type">) {
  const labels: Record<Enums<"entry_type">, string> = {
    locais: "Evangelização e integração",
    ribeirinhas: "Viagem, base e acompanhamento",
    nacionais: "Cooperação nacional",
    mundiais: "Sustento e envio",
    convertidos: "Primeiros passos",
    visitantes: "Acolhimento",
    discipulado: "Formação espiritual",
    treinamento: "Capacitação",
    missionarios: "Cuidado e sustento",
    projetos: "Logística missionária",
    campanhas: "Mobilização",
    tesouraria: "Financeiro missionário",
    atas: "Governança",
    agenda: "Calendário",
    equipe: "Pessoas e acessos",
  };
  return labels[type];
}

function addDays(days: number, hours = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function dateOnly(value: string) {
  return value.slice(0, 10);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

function emptySummary(skipped: boolean): SeedSummary {
  return {
    skipped,
    people: 0,
    pipelineCards: 0,
    tasks: 0,
    interactions: 0,
    events: 0,
    campaigns: 0,
    financialEntries: 0,
    missionEntries: 0,
  };
}
