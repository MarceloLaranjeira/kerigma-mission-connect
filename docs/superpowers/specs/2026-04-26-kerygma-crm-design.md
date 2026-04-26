# Kerygma CRM Design

Date: 2026-04-26
Status: Approved in conversation, pending written-spec review
Scope: Replace the current generic mission registry with a production-ready church CRM that matches the provided visual reference and runs on a properly modeled Supabase backend.

## Goals

- Deliver a CRM frontend visually aligned with the reference image: premium sidebar, top search, KPI row, pipeline, charts, activity panels, tasks, timeline, and operations cards.
- Replace the current generic `entries`-driven workflow with a relational CRM model designed for real day-to-day church operations.
- Make the first delivery fully operational for CRM workflows without external WhatsApp or AI integrations.
- Preserve the existing authentication foundation, then extend permissions and operational modules around it.

## Non-Goals

- Real WhatsApp integration in this first delivery.
- Real AI assistant integration in this first delivery.
- Migrating legacy `entries` data into the new CRM model. The system will be rebuilt on the correct structure.

## Product Direction

The application will stop behaving like a collection of isolated mission CRUD pages and become a single CRM platform for people, follow-up, pipeline, events, campaigns, financial operations, and team management.

The new product should feel close to the reference image, but it will be adapted to Kerygma's church context. The layout and navigation will be premium and dashboard-first, while the data model and flows will support real pastoral and mission work.

## Main Modules

### 1. Dashboard

The dashboard is the operational home screen. It will display:

- KPI cards for people in follow-up, active discipleship, upcoming tasks, scheduled visits, campaign totals, and financial summaries
- conversion and follow-up charts
- mission front distribution
- recent activities
- today tasks
- pipeline summary
- upcoming events
- quick access actions

The dashboard must be driven by real Supabase queries and not by mocked arrays.

### 2. People

`People` becomes the CRM core.

Each record represents a person and may participate in one or more church states over time, such as visitor, convert, discipleship participant, member, volunteer, or missionary. Those are not separate disconnected registries; they are views and statuses over the same person lifecycle.

Each person profile should support:

- identity and contact data
- household/family link
- neighborhood and address fields
- origin/source of contact
- assigned team or responsible person
- current lifecycle status
- tags
- notes
- campaign association
- timeline of interactions
- linked tasks
- linked events

### 3. Pipeline

The pipeline will be a real kanban/funnel, visually close to the reference image.

Initial recommended stages:

- Visitante
- Primeiro Contato
- Acompanhamento
- Discipulado
- Integração
- Membro

Each card should support:

- linked person or household
- responsible user
- priority
- source
- summary
- next action
- next action date
- stage movement
- quick note registration
- quick task creation

Pipeline movement must persist to Supabase and update dashboard metrics.

### 4. Activities

Activities are pastoral and operational interactions, not checklist tasks.

Examples:

- call
- visit
- prayer
- meeting
- worship attendance
- follow-up message
- conversion decision
- discipleship progress
- profile update

Each activity must be linked to a person and optionally to a campaign, event, task, or front. Activities must feed the person's timeline and overall dashboard recency widgets.

### 5. Tasks

Tasks are actionable commitments for staff and volunteers.

Each task should support:

- title
- description
- responsible user
- due date and time
- priority
- status
- linked person
- linked event
- linked campaign

Task lists should support filters by status, responsible, due date, and priority.

### 6. Agenda

Agenda manages calendar operations such as:

- visits
- trainings
- campaigns
- worship-linked actions
- meetings
- trips
- mission events

An event can optionally relate to people, campaigns, teams, and mission fronts.

### 7. Campaigns

Campaigns organize structured mission efforts such as local outreach, conferences, missionary support, trips, or seasonal church actions.

Each campaign should support:

- title
- description
- status
- date range
- responsible team
- linked people
- linked events
- linked financial entries
- progress metrics

### 8. Financial

Financial operations must support real tracking of:

- income
- expense
- category
- date
- amount
- campaign relation
- notes
- responsible user

Dashboards should aggregate campaign totals, monthly totals, and balance views.

### 9. Team

The existing team management foundation will remain, but it will be integrated into the CRM model.

This module should support:

- user role management
- church/ministry responsibility assignment
- visibility rules by role
- active/pending/inactive profile status
- team membership across fronts

### 10. Reports

Reports should initially cover:

- people by lifecycle stage
- pipeline conversion counts
- pending follow-up
- tasks by status
- events by period
- campaigns by status
- financial totals by period and category

## Visual Direction

The frontend should be redesigned to feel very close to the provided screenshot.

Core visual requirements:

- fixed premium sidebar
- top header with greeting, search, notifications, and user avatar
- large KPI blocks
- dark and light premium surfaces in the same composition
- pipeline cards visible on the dashboard
- chart area with strong contrast
- auxiliary right-side information cards
- polished spacing, gradients, borders, and shadows

The Kerygma identity should replace the white-label example branding while preserving the same class of visual impact.

## Information Architecture

Primary navigation:

- Dashboard
- Pessoas
- Pipeline
- Atividades
- Tarefas
- Agenda
- Campanhas
- Financeiro
- Equipe
- Relatórios
- Configurações

The current mission pages such as `locais`, `ribeirinhas`, `nacionais`, and `mundiais` will no longer be isolated CRUD products. They will become filters, tags, fronts, or classification dimensions inside the CRM.

## Data Model

The current generic `entries` table is not sufficient for a production CRM. A new relational model will be created.

### Core Tables

- `crm_people`
- `crm_households`
- `crm_household_members`
- `crm_tags`
- `crm_people_tags`
- `crm_sources`
- `crm_stages`
- `crm_pipeline_cards`
- `crm_interactions`
- `crm_tasks`
- `crm_events`
- `crm_campaigns`
- `crm_campaign_people`
- `crm_campaign_events`
- `crm_financial_categories`
- `crm_financial_entries`
- `crm_notes`

### Existing Tables to Reuse

- `profiles`
- `user_roles`

### Suggested Key Fields

`crm_people`

- id
- full_name
- preferred_name
- email
- phone
- whatsapp
- birth_date
- marital_status
- address_line
- neighborhood
- city
- state
- source_id
- current_stage_id
- lifecycle_status
- assigned_user_id
- front
- is_active
- created_at
- updated_at

`crm_pipeline_cards`

- id
- person_id
- stage_id
- priority
- summary
- next_action
- next_action_at
- assigned_user_id
- order_index
- created_by
- created_at
- updated_at

`crm_interactions`

- id
- person_id
- type
- title
- description
- happened_at
- responsible_user_id
- linked_task_id
- linked_event_id
- linked_campaign_id
- created_at

`crm_tasks`

- id
- person_id
- title
- description
- status
- priority
- due_at
- responsible_user_id
- linked_event_id
- linked_campaign_id
- created_by
- created_at
- updated_at

`crm_events`

- id
- title
- description
- event_type
- starts_at
- ends_at
- location
- front
- responsible_user_id
- created_at
- updated_at

`crm_campaigns`

- id
- title
- description
- status
- starts_at
- ends_at
- front
- owner_user_id
- goal_amount
- created_at
- updated_at

`crm_financial_entries`

- id
- type
- category_id
- campaign_id
- amount
- entry_date
- description
- responsible_user_id
- created_by
- created_at

## Permissions and Security

Authentication remains in Supabase auth.

Roles:

- `admin`: full system control
- `coordenador`: manages operations and teams
- `editor`: manages operational records
- `voluntario`: restricted usage with limited creation/visibility

RLS must be rewritten or extended so the new CRM tables follow the same permission model consistently.

Key principles:

- every authenticated user only sees what their role allows
- every mutating action must respect role and active profile status
- important records must keep `created_by`, `assigned_user_id`, and timestamps
- dashboards must not bypass row-level policies

## Frontend Architecture

The current generic CRUD pattern will not be the main foundation of the CRM UI.

The frontend should move to domain-specific modules:

- CRM layout shell
- dashboard widgets
- people list and people detail drawer/page
- pipeline board and pipeline card details
- activity feed components
- task views
- calendar/event views
- campaign views
- financial views
- report views

Shared infrastructure to keep:

- auth context
- Supabase client integration
- reusable UI primitives already present in `src/components/ui`

Shared infrastructure to replace or reduce:

- `useEntries`
- `CrudPage`
- `EntryDialog`
- the route-per-generic-entry pattern

## Routing Direction

Recommended route structure:

- `/`
- `/pessoas`
- `/pessoas/:id`
- `/pipeline`
- `/atividades`
- `/tarefas`
- `/agenda`
- `/campanhas`
- `/campanhas/:id`
- `/financeiro`
- `/relatorios`
- `/equipe`
- `/configuracoes`

Optional future deep-link routes can be added after the initial CRM base is stable.

## Implementation Strategy

### Phase 1. Backend Foundation

- create CRM enums and relational tables
- define indexes and foreign keys
- create seed records for initial pipeline stages and financial categories
- add or update RLS policies
- keep legacy tables intact during the build to avoid breaking auth

### Phase 2. Domain Layer

- add generated or hand-maintained types for the new schema
- create domain hooks and services for people, pipeline, tasks, events, campaigns, and finance
- centralize formatting and query helpers

### Phase 3. CRM Shell and Dashboard

- replace current mission-first layout with CRM layout
- implement the new sidebar and topbar
- build dashboard widgets from real queries

### Phase 4. Core Operations

- implement People
- implement Pipeline
- implement Activities
- implement Tasks

### Phase 5. Operations Expansion

- implement Agenda
- implement Campaigns
- implement Financial
- implement Reports

### Phase 6. Team and Settings Consolidation

- adapt team management to the CRM shell
- keep profile and role management coherent with the new navigation

### Phase 7. Cleanup

- remove obsolete mission CRUD routes once replacements are stable
- remove generic entry flows no longer in use
- keep only what still serves the CRM

## Testing Strategy

The build must be verified in three layers.

### 1. Access and Security

- login and protected routes
- role restrictions
- active vs pending users
- protected create/update/delete actions

### 2. Critical Flows

- create and edit person
- move person through pipeline
- create interaction from person detail
- create task and complete task
- create event
- create campaign
- add financial entry

### 3. Dashboard and Reporting Consistency

- KPIs reflect current data
- filters return expected records
- timelines and linked entities stay synchronized
- empty states and error states render correctly

## Risks

- the current codebase is organized around generic CRUD pages, so replacing that pattern will touch routing, layout, and data access at the same time
- the current `entries` table may still be referenced by pages during migration, so phased replacement is necessary
- without external integrations in phase one, some visual cards inspired by the reference must be adapted to internal CRM data only

## Open Decisions Resolved in Conversation

- The frontend should stay very close to the provided screenshot.
- Missing modules should be created rather than mocked.
- The CRM must be real and operational, not visual-only.
- The backend should be rebuilt the correct way instead of preserving the generic structure.
- WhatsApp and AI integrations are out of the first delivery.

## Acceptance Criteria for Phase One

- user can authenticate and reach the CRM shell
- user can manage people records in a real relational model
- user can move people through pipeline stages
- user can register interactions and tasks tied to people
- user can manage events, campaigns, and financial entries
- dashboard is populated from live CRM data
- permissions remain enforced through Supabase auth and RLS
- interface has been redesigned to visually align with the approved reference direction

## Delivery Note

This specification was written in the local workspace. A git commit could not be created at this stage because the current workspace is not initialized as a git repository.
