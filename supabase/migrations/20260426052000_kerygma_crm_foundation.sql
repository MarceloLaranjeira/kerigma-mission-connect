-- CRM enums
create type public.crm_lifecycle_status as enum (
  'visitante',
  'primeiro_contato',
  'acompanhamento',
  'discipulado',
  'membro',
  'voluntario',
  'missionario',
  'inativo'
);

create type public.crm_front as enum (
  'geral',
  'locais',
  'ribeirinhas',
  'nacionais',
  'mundiais',
  'discipulado',
  'treinamento',
  'tesouraria'
);

create type public.crm_priority as enum ('baixa', 'media', 'alta', 'urgente');
create type public.crm_task_status as enum ('aberta', 'em_andamento', 'concluida', 'cancelada');
create type public.crm_event_type as enum ('visita', 'treinamento', 'campanha', 'culto', 'reuniao', 'viagem', 'evangelismo');
create type public.crm_campaign_status as enum ('rascunho', 'ativa', 'pausada', 'concluida', 'cancelada');
create type public.crm_financial_type as enum ('entrada', 'saida');
create type public.crm_interaction_type as enum ('ligacao', 'visita', 'oracao', 'reuniao', 'culto', 'mensagem', 'decisao', 'discipulado', 'nota');

-- CRM helpers
create or replace function public.crm_user_is_active(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = _user_id
      and status = 'ativo'
  )
$$;

create or replace function public.crm_can_manage(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.crm_user_is_active(_user_id)
    and exists (
      select 1
      from public.user_roles
      where user_id = _user_id
        and role in ('admin', 'coordenador', 'editor')
    )
$$;

-- CRM core tables
create table public.crm_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind text not null default 'manual',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.crm_stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position integer not null,
  color text not null default '#1d4ed8',
  is_closed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.crm_households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  address_line text,
  neighborhood text,
  city text,
  state text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  preferred_name text,
  email text,
  phone text,
  whatsapp text,
  birth_date date,
  marital_status text,
  address_line text,
  neighborhood text,
  city text,
  state text,
  source_id uuid references public.crm_sources(id) on delete set null,
  current_stage_id uuid references public.crm_stages(id) on delete set null,
  lifecycle_status public.crm_lifecycle_status not null default 'visitante',
  assigned_user_id uuid references public.profiles(id) on delete set null,
  front public.crm_front not null default 'geral',
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_household_members (
  household_id uuid not null references public.crm_households(id) on delete cascade,
  person_id uuid not null references public.crm_people(id) on delete cascade,
  relation_label text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (household_id, person_id)
);

create table public.crm_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#2563eb',
  created_at timestamptz not null default now()
);

create table public.crm_people_tags (
  person_id uuid not null references public.crm_people(id) on delete cascade,
  tag_id uuid not null references public.crm_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (person_id, tag_id)
);

create table public.crm_pipeline_cards (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null unique references public.crm_people(id) on delete cascade,
  stage_id uuid not null references public.crm_stages(id) on delete restrict,
  priority public.crm_priority not null default 'media',
  summary text,
  next_action text,
  next_action_at timestamptz,
  assigned_user_id uuid references public.profiles(id) on delete set null,
  order_index integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status public.crm_campaign_status not null default 'rascunho',
  starts_at timestamptz,
  ends_at timestamptz,
  front public.crm_front not null default 'geral',
  owner_user_id uuid references public.profiles(id) on delete set null,
  goal_amount numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type public.crm_event_type not null default 'reuniao',
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  front public.crm_front not null default 'geral',
  responsible_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.crm_people(id) on delete set null,
  title text not null,
  description text,
  status public.crm_task_status not null default 'aberta',
  priority public.crm_priority not null default 'media',
  due_at timestamptz,
  responsible_user_id uuid references public.profiles(id) on delete set null,
  linked_event_id uuid references public.crm_events(id) on delete set null,
  linked_campaign_id uuid references public.crm_campaigns(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crm_interactions (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.crm_people(id) on delete cascade,
  type public.crm_interaction_type not null default 'nota',
  title text not null,
  description text,
  happened_at timestamptz not null default now(),
  responsible_user_id uuid references public.profiles(id) on delete set null,
  linked_task_id uuid references public.crm_tasks(id) on delete set null,
  linked_event_id uuid references public.crm_events(id) on delete set null,
  linked_campaign_id uuid references public.crm_campaigns(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.crm_campaign_people (
  campaign_id uuid not null references public.crm_campaigns(id) on delete cascade,
  person_id uuid not null references public.crm_people(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, person_id)
);

create table public.crm_campaign_events (
  campaign_id uuid not null references public.crm_campaigns(id) on delete cascade,
  event_id uuid not null references public.crm_events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, event_id)
);

create table public.crm_financial_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#2563eb',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.crm_financial_entries (
  id uuid primary key default gen_random_uuid(),
  type public.crm_financial_type not null,
  category_id uuid references public.crm_financial_categories(id) on delete set null,
  campaign_id uuid references public.crm_campaigns(id) on delete set null,
  amount numeric(12,2) not null,
  entry_date date not null default current_date,
  description text,
  responsible_user_id uuid references public.profiles(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.crm_people(id) on delete cascade,
  note text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index crm_people_lifecycle_idx on public.crm_people(lifecycle_status);
create index crm_people_front_idx on public.crm_people(front);
create index crm_people_assigned_idx on public.crm_people(assigned_user_id);
create index crm_pipeline_cards_stage_idx on public.crm_pipeline_cards(stage_id, order_index);
create index crm_tasks_status_idx on public.crm_tasks(status, due_at);
create index crm_interactions_person_idx on public.crm_interactions(person_id, happened_at desc);
create index crm_financial_entries_date_idx on public.crm_financial_entries(entry_date desc);

create trigger crm_people_updated before update on public.crm_people
  for each row execute function public.set_updated_at();
create trigger crm_households_updated before update on public.crm_households
  for each row execute function public.set_updated_at();
create trigger crm_pipeline_cards_updated before update on public.crm_pipeline_cards
  for each row execute function public.set_updated_at();
create trigger crm_campaigns_updated before update on public.crm_campaigns
  for each row execute function public.set_updated_at();
create trigger crm_events_updated before update on public.crm_events
  for each row execute function public.set_updated_at();
create trigger crm_tasks_updated before update on public.crm_tasks
  for each row execute function public.set_updated_at();

-- seed defaults
insert into public.crm_stages (name, slug, position, color, is_closed)
values
  ('Visitante', 'visitante', 1, '#2563eb', false),
  ('Primeiro Contato', 'primeiro-contato', 2, '#0ea5e9', false),
  ('Acompanhamento', 'acompanhamento', 3, '#f59e0b', false),
  ('Discipulado', 'discipulado', 4, '#14b8a6', false),
  ('Integração', 'integracao', 5, '#22c55e', false),
  ('Membro', 'membro', 6, '#16a34a', true)
on conflict (slug) do nothing;

insert into public.crm_sources (name, kind)
values
  ('Culto', 'presencial'),
  ('Evangelismo', 'acao'),
  ('Indicação', 'relacionamento'),
  ('Campanha', 'campanha'),
  ('Site', 'digital'),
  ('Manual', 'manual')
on conflict (name) do nothing;

insert into public.crm_financial_categories (name, color, sort_order)
values
  ('Ofertas Missionárias', '#2563eb', 1),
  ('Campanhas', '#0ea5e9', 2),
  ('Viagens', '#22c55e', 3),
  ('Treinamentos', '#f59e0b', 4),
  ('Ação Social', '#8b5cf6', 5),
  ('Operacional', '#64748b', 6)
on conflict (name) do nothing;

-- RLS
alter table public.crm_sources enable row level security;
alter table public.crm_stages enable row level security;
alter table public.crm_households enable row level security;
alter table public.crm_people enable row level security;
alter table public.crm_household_members enable row level security;
alter table public.crm_tags enable row level security;
alter table public.crm_people_tags enable row level security;
alter table public.crm_pipeline_cards enable row level security;
alter table public.crm_campaigns enable row level security;
alter table public.crm_events enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_interactions enable row level security;
alter table public.crm_campaign_people enable row level security;
alter table public.crm_campaign_events enable row level security;
alter table public.crm_financial_categories enable row level security;
alter table public.crm_financial_entries enable row level security;
alter table public.crm_notes enable row level security;

create policy "CRM active members can read sources"
  on public.crm_sources for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage sources"
  on public.crm_sources for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read stages"
  on public.crm_stages for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage stages"
  on public.crm_stages for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read households"
  on public.crm_households for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage households"
  on public.crm_households for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read people"
  on public.crm_people for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage people"
  on public.crm_people for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read household links"
  on public.crm_household_members for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage household links"
  on public.crm_household_members for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read tags"
  on public.crm_tags for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage tags"
  on public.crm_tags for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read people tags"
  on public.crm_people_tags for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage people tags"
  on public.crm_people_tags for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read pipeline"
  on public.crm_pipeline_cards for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage pipeline"
  on public.crm_pipeline_cards for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read campaigns"
  on public.crm_campaigns for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage campaigns"
  on public.crm_campaigns for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read events"
  on public.crm_events for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage events"
  on public.crm_events for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read tasks"
  on public.crm_tasks for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage tasks"
  on public.crm_tasks for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read interactions"
  on public.crm_interactions for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage interactions"
  on public.crm_interactions for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read campaign people"
  on public.crm_campaign_people for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage campaign people"
  on public.crm_campaign_people for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read campaign events"
  on public.crm_campaign_events for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage campaign events"
  on public.crm_campaign_events for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read financial categories"
  on public.crm_financial_categories for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage financial categories"
  on public.crm_financial_categories for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read financial entries"
  on public.crm_financial_entries for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage financial entries"
  on public.crm_financial_entries for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));

create policy "CRM active members can read notes"
  on public.crm_notes for select to authenticated
  using (public.crm_user_is_active(auth.uid()));
create policy "CRM managers manage notes"
  on public.crm_notes for all to authenticated
  using (public.crm_can_manage(auth.uid()))
  with check (public.crm_can_manage(auth.uid()));
