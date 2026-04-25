-- ENUMS
create type public.app_role as enum ('admin', 'coordenador', 'editor', 'voluntario');
create type public.member_status as enum ('pendente', 'ativo', 'inativo');
create type public.ministry_area as enum ('locais', 'ribeirinhas', 'nacionais', 'mundiais', 'discipulado', 'treinamento', 'tesouraria', 'geral');
create type public.entry_type as enum (
  'locais','ribeirinhas','nacionais','mundiais',
  'convertidos','visitantes','discipulado','treinamento',
  'missionarios','projetos','campanhas','tesouraria','atas','agenda','equipe'
);

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  birth_date date,
  neighborhood text,
  ministry_role text,           -- Diretor, Coordenador, Secretário, Tesoureiro, Missionário, Voluntário
  ministry_area public.ministry_area default 'geral',
  joined_at date,
  baptism_date date,
  small_group text,             -- GC
  ebk_completed boolean default false,
  gifts text,
  status public.member_status not null default 'pendente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

-- ENTRIES (registros genéricos para todos os módulos)
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  type public.entry_type not null,
  title text not null,
  subtitle text,
  description text,
  tag text,                     -- ex: "Ativo", "Programada", "Entrada"
  meta text,                    -- ex: "Próx: 28/04", "R$ 4.820"
  event_date date,
  amount numeric(12,2),
  status text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index entries_type_idx on public.entries(type);

-- TASKS
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_time text,
  done boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.entries enable row level security;
alter table public.tasks enable row level security;

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- can_edit: admin, coordenador, editor (e ativo)
create or replace function public.can_edit(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = _user_id
      and ur.role in ('admin','coordenador','editor')
      and p.status = 'ativo'
  )
$$;

-- TRIGGER: updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger entries_updated before update on public.entries
  for each row execute function public.set_updated_at();

-- TRIGGER: auto-create profile + role no signup; primeiro vira admin/ativo
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_first boolean;
begin
  select count(*) = 0 into is_first from public.profiles;

  insert into public.profiles (id, full_name, email, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email,
    case when is_first then 'ativo'::public.member_status else 'pendente'::public.member_status end
  );

  insert into public.user_roles (user_id, role)
  values (new.id, case when is_first then 'admin'::public.app_role else 'voluntario'::public.app_role end);

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- POLICIES: profiles
create policy "Profiles selecionáveis por autenticados"
  on public.profiles for select to authenticated using (true);

create policy "Usuário edita o próprio perfil"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and status = (select status from public.profiles where id = auth.uid()));

create policy "Admin atualiza qualquer perfil"
  on public.profiles for update to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create policy "Admin deleta perfil"
  on public.profiles for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- POLICIES: user_roles
create policy "Roles visíveis para autenticados"
  on public.user_roles for select to authenticated using (true);
create policy "Admin gere papéis"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- POLICIES: entries
create policy "Entries visíveis para autenticados"
  on public.entries for select to authenticated using (true);
create policy "Editores criam entries"
  on public.entries for insert to authenticated
  with check (public.can_edit(auth.uid()));
create policy "Editores atualizam entries"
  on public.entries for update to authenticated
  using (public.can_edit(auth.uid()))
  with check (public.can_edit(auth.uid()));
create policy "Editores deletam entries"
  on public.entries for delete to authenticated
  using (public.can_edit(auth.uid()));

-- POLICIES: tasks
create policy "Tasks visíveis para autenticados"
  on public.tasks for select to authenticated using (true);
create policy "Editores gerem tasks"
  on public.tasks for all to authenticated
  using (public.can_edit(auth.uid()))
  with check (public.can_edit(auth.uid()));
