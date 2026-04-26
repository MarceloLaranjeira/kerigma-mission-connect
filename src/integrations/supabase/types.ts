export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          action: string | null
          created_at: string
          details: Json | null
          email: string | null
          event: string
          id: string
          ip: string | null
          resource: string | null
          role_at_event: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          details?: Json | null
          email?: string | null
          event: string
          id?: string
          ip?: string | null
          resource?: string | null
          role_at_event?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          details?: Json | null
          email?: string | null
          event?: string
          id?: string
          ip?: string | null
          resource?: string | null
          role_at_event?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      crm_campaign_events: {
        Row: {
          campaign_id: string
          created_at: string
          event_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          event_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          event_id?: string
        }
        Relationships: []
      }
      crm_campaign_people: {
        Row: {
          campaign_id: string
          created_at: string
          person_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          person_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          person_id?: string
        }
        Relationships: []
      }
      crm_campaigns: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string | null
          front: Database["public"]["Enums"]["crm_front"]
          goal_amount: number | null
          id: string
          owner_user_id: string | null
          starts_at: string | null
          status: Database["public"]["Enums"]["crm_campaign_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          front?: Database["public"]["Enums"]["crm_front"]
          goal_amount?: number | null
          id?: string
          owner_user_id?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["crm_campaign_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          front?: Database["public"]["Enums"]["crm_front"]
          goal_amount?: number | null
          id?: string
          owner_user_id?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["crm_campaign_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_events: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["crm_event_type"]
          front: Database["public"]["Enums"]["crm_front"]
          id: string
          location: string | null
          responsible_user_id: string | null
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["crm_event_type"]
          front?: Database["public"]["Enums"]["crm_front"]
          id?: string
          location?: string | null
          responsible_user_id?: string | null
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["crm_event_type"]
          front?: Database["public"]["Enums"]["crm_front"]
          id?: string
          location?: string | null
          responsible_user_id?: string | null
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_financial_categories: {
        Row: {
          active: boolean
          color: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      crm_financial_entries: {
        Row: {
          amount: number
          campaign_id: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          entry_date: string
          id: string
          responsible_user_id: string | null
          type: Database["public"]["Enums"]["crm_financial_type"]
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_date?: string
          id?: string
          responsible_user_id?: string | null
          type: Database["public"]["Enums"]["crm_financial_type"]
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_date?: string
          id?: string
          responsible_user_id?: string | null
          type?: Database["public"]["Enums"]["crm_financial_type"]
        }
        Relationships: []
      }
      crm_household_members: {
        Row: {
          created_at: string
          household_id: string
          is_primary: boolean
          person_id: string
          relation_label: string | null
        }
        Insert: {
          created_at?: string
          household_id: string
          is_primary?: boolean
          person_id: string
          relation_label?: string | null
        }
        Update: {
          created_at?: string
          household_id?: string
          is_primary?: boolean
          person_id?: string
          relation_label?: string | null
        }
        Relationships: []
      }
      crm_households: {
        Row: {
          address_line: string | null
          city: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          neighborhood: string | null
          notes: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          notes?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          notes?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_interactions: {
        Row: {
          created_at: string
          description: string | null
          happened_at: string
          id: string
          linked_campaign_id: string | null
          linked_event_id: string | null
          linked_task_id: string | null
          person_id: string
          responsible_user_id: string | null
          title: string
          type: Database["public"]["Enums"]["crm_interaction_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          happened_at?: string
          id?: string
          linked_campaign_id?: string | null
          linked_event_id?: string | null
          linked_task_id?: string | null
          person_id: string
          responsible_user_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["crm_interaction_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          happened_at?: string
          id?: string
          linked_campaign_id?: string | null
          linked_event_id?: string | null
          linked_task_id?: string | null
          person_id?: string
          responsible_user_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["crm_interaction_type"]
        }
        Relationships: []
      }
      crm_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          person_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          person_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          person_id?: string
        }
        Relationships: []
      }
      crm_people: {
        Row: {
          address_line: string | null
          assigned_user_id: string | null
          birth_date: string | null
          city: string | null
          created_at: string
          current_stage_id: string | null
          email: string | null
          front: Database["public"]["Enums"]["crm_front"]
          full_name: string
          id: string
          is_active: boolean
          lifecycle_status: Database["public"]["Enums"]["crm_lifecycle_status"]
          marital_status: string | null
          neighborhood: string | null
          notes: string | null
          phone: string | null
          preferred_name: string | null
          source_id: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address_line?: string | null
          assigned_user_id?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          current_stage_id?: string | null
          email?: string | null
          front?: Database["public"]["Enums"]["crm_front"]
          full_name: string
          id?: string
          is_active?: boolean
          lifecycle_status?: Database["public"]["Enums"]["crm_lifecycle_status"]
          marital_status?: string | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          preferred_name?: string | null
          source_id?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address_line?: string | null
          assigned_user_id?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          current_stage_id?: string | null
          email?: string | null
          front?: Database["public"]["Enums"]["crm_front"]
          full_name?: string
          id?: string
          is_active?: boolean
          lifecycle_status?: Database["public"]["Enums"]["crm_lifecycle_status"]
          marital_status?: string | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          preferred_name?: string | null
          source_id?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      crm_people_tags: {
        Row: {
          created_at: string
          person_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          person_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          person_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      crm_pipeline_cards: {
        Row: {
          assigned_user_id: string | null
          created_at: string
          created_by: string | null
          id: string
          next_action: string | null
          next_action_at: string | null
          order_index: number
          person_id: string
          priority: Database["public"]["Enums"]["crm_priority"]
          stage_id: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          assigned_user_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          next_action?: string | null
          next_action_at?: string | null
          order_index?: number
          person_id: string
          priority?: Database["public"]["Enums"]["crm_priority"]
          stage_id: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          assigned_user_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          next_action?: string | null
          next_action_at?: string | null
          order_index?: number
          person_id?: string
          priority?: Database["public"]["Enums"]["crm_priority"]
          stage_id?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_sources: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          name?: string
        }
        Relationships: []
      }
      crm_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          is_closed: boolean
          name: string
          position: number
          slug: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_closed?: boolean
          name: string
          position: number
          slug: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_closed?: boolean
          name?: string
          position?: number
          slug?: string
        }
        Relationships: []
      }
      crm_tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          due_at: string | null
          id: string
          linked_campaign_id: string | null
          linked_event_id: string | null
          person_id: string | null
          priority: Database["public"]["Enums"]["crm_priority"]
          responsible_user_id: string | null
          status: Database["public"]["Enums"]["crm_task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          linked_campaign_id?: string | null
          linked_event_id?: string | null
          person_id?: string | null
          priority?: Database["public"]["Enums"]["crm_priority"]
          responsible_user_id?: string | null
          status?: Database["public"]["Enums"]["crm_task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          linked_campaign_id?: string | null
          linked_event_id?: string | null
          person_id?: string | null
          priority?: Database["public"]["Enums"]["crm_priority"]
          responsible_user_id?: string | null
          status?: Database["public"]["Enums"]["crm_task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      entries: {
        Row: {
          amount: number | null
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string | null
          id: string
          meta: string | null
          status: string | null
          subtitle: string | null
          tag: string | null
          title: string
          type: Database["public"]["Enums"]["entry_type"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          meta?: string | null
          status?: string | null
          subtitle?: string | null
          tag?: string | null
          title: string
          type: Database["public"]["Enums"]["entry_type"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          meta?: string | null
          status?: string | null
          subtitle?: string | null
          tag?: string | null
          title?: string
          type?: Database["public"]["Enums"]["entry_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          baptism_date: string | null
          birth_date: string | null
          created_at: string
          ebk_completed: boolean | null
          email: string | null
          full_name: string
          gifts: string | null
          id: string
          joined_at: string | null
          ministry_area: Database["public"]["Enums"]["ministry_area"] | null
          ministry_role: string | null
          neighborhood: string | null
          phone: string | null
          small_group: string | null
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          baptism_date?: string | null
          birth_date?: string | null
          created_at?: string
          ebk_completed?: boolean | null
          email?: string | null
          full_name: string
          gifts?: string | null
          id: string
          joined_at?: string | null
          ministry_area?: Database["public"]["Enums"]["ministry_area"] | null
          ministry_role?: string | null
          neighborhood?: string | null
          phone?: string | null
          small_group?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          baptism_date?: string | null
          birth_date?: string | null
          created_at?: string
          ebk_completed?: boolean | null
          email?: string | null
          full_name?: string
          gifts?: string | null
          id?: string
          joined_at?: string | null
          ministry_area?: Database["public"]["Enums"]["ministry_area"] | null
          ministry_role?: string | null
          neighborhood?: string | null
          phone?: string | null
          small_group?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          created_by: string | null
          done: boolean
          due_time: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          done?: boolean
          due_time?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          done?: boolean
          due_time?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit: { Args: { _user_id: string }; Returns: boolean }
      crm_can_manage: { Args: { _user_id: string }; Returns: boolean }
      crm_user_is_active: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "coordenador" | "editor" | "voluntario"
      crm_campaign_status: "rascunho" | "ativa" | "pausada" | "concluida" | "cancelada"
      crm_event_type: "visita" | "treinamento" | "campanha" | "culto" | "reuniao" | "viagem" | "evangelismo"
      crm_financial_type: "entrada" | "saida"
      crm_front:
        | "geral"
        | "locais"
        | "ribeirinhas"
        | "nacionais"
        | "mundiais"
        | "discipulado"
        | "treinamento"
        | "tesouraria"
      crm_interaction_type: "ligacao" | "visita" | "oracao" | "reuniao" | "culto" | "mensagem" | "decisao" | "discipulado" | "nota"
      crm_lifecycle_status:
        | "visitante"
        | "primeiro_contato"
        | "acompanhamento"
        | "discipulado"
        | "membro"
        | "voluntario"
        | "missionario"
        | "inativo"
      crm_priority: "baixa" | "media" | "alta" | "urgente"
      crm_task_status: "aberta" | "em_andamento" | "concluida" | "cancelada"
      entry_type:
        | "locais"
        | "ribeirinhas"
        | "nacionais"
        | "mundiais"
        | "convertidos"
        | "visitantes"
        | "discipulado"
        | "treinamento"
        | "missionarios"
        | "projetos"
        | "campanhas"
        | "tesouraria"
        | "atas"
        | "agenda"
        | "equipe"
      member_status: "pendente" | "ativo" | "inativo"
      ministry_area:
        | "locais"
        | "ribeirinhas"
        | "nacionais"
        | "mundiais"
        | "discipulado"
        | "treinamento"
        | "tesouraria"
        | "geral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coordenador", "editor", "voluntario"],
      crm_campaign_status: ["rascunho", "ativa", "pausada", "concluida", "cancelada"],
      crm_event_type: ["visita", "treinamento", "campanha", "culto", "reuniao", "viagem", "evangelismo"],
      crm_financial_type: ["entrada", "saida"],
      crm_front: ["geral", "locais", "ribeirinhas", "nacionais", "mundiais", "discipulado", "treinamento", "tesouraria"],
      crm_interaction_type: ["ligacao", "visita", "oracao", "reuniao", "culto", "mensagem", "decisao", "discipulado", "nota"],
      crm_lifecycle_status: [
        "visitante",
        "primeiro_contato",
        "acompanhamento",
        "discipulado",
        "membro",
        "voluntario",
        "missionario",
        "inativo",
      ],
      crm_priority: ["baixa", "media", "alta", "urgente"],
      crm_task_status: ["aberta", "em_andamento", "concluida", "cancelada"],
      entry_type: [
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
      ],
      member_status: ["pendente", "ativo", "inativo"],
      ministry_area: [
        "locais",
        "ribeirinhas",
        "nacionais",
        "mundiais",
        "discipulado",
        "treinamento",
        "tesouraria",
        "geral",
      ],
    },
  },
} as const
