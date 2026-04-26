export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
