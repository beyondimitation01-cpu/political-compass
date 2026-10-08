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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      complaints: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          rating: number
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          rating: number
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          rating?: number
        }
        Relationships: []
      }
      figure_policy_records: {
        Row: {
          bill_or_policy: string | null
          created_at: string
          created_by: string | null
          description: string
          figure_name: string
          figure_slug: string
          id: string
          legislative_body: string | null
          policy_topic: string
          position: string
          published: boolean
          record_type: string
          recorded_at: string | null
          source_publisher: string | null
          source_title: string
          source_url: string
          updated_at: string
          verification_notes: string
          verification_status: string
          vote: string | null
        }
        Insert: {
          bill_or_policy?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          figure_name: string
          figure_slug: string
          id?: string
          legislative_body?: string | null
          policy_topic: string
          position: string
          published?: boolean
          record_type?: string
          recorded_at?: string | null
          source_publisher?: string | null
          source_title: string
          source_url: string
          updated_at?: string
          verification_notes?: string
          verification_status?: string
          vote?: string | null
        }
        Update: {
          bill_or_policy?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          figure_name?: string
          figure_slug?: string
          id?: string
          legislative_body?: string | null
          policy_topic?: string
          position?: string
          published?: boolean
          record_type?: string
          recorded_at?: string | null
          source_publisher?: string | null
          source_title?: string
          source_url?: string
          updated_at?: string
          verification_notes?: string
          verification_status?: string
          vote?: string | null
        }
        Relationships: []
      }
      figure_quotes: {
        Row: {
          context: string
          created_at: string
          created_by: string | null
          figure_name: string
          figure_slug: string
          id: string
          published: boolean
          quote_text: string
          source_publisher: string | null
          source_title: string
          source_url: string
          spoken_at: string | null
          statement_type: string
          topic_tags: string[]
          updated_at: string
          venue: string | null
          verification_notes: string
          verification_status: string
        }
        Insert: {
          context?: string
          created_at?: string
          created_by?: string | null
          figure_name: string
          figure_slug: string
          id?: string
          published?: boolean
          quote_text: string
          source_publisher?: string | null
          source_title: string
          source_url: string
          spoken_at?: string | null
          statement_type?: string
          topic_tags?: string[]
          updated_at?: string
          venue?: string | null
          verification_notes?: string
          verification_status?: string
        }
        Update: {
          context?: string
          created_at?: string
          created_by?: string | null
          figure_name?: string
          figure_slug?: string
          id?: string
          published?: boolean
          quote_text?: string
          source_publisher?: string | null
          source_title?: string
          source_url?: string
          spoken_at?: string | null
          statement_type?: string
          topic_tags?: string[]
          updated_at?: string
          venue?: string | null
          verification_notes?: string
          verification_status?: string
        }
        Relationships: []
      }
      figure_relationships: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          ended_at: string | null
          from_figure_name: string
          from_figure_slug: string
          id: string
          published: boolean
          relationship_type: string
          source_publisher: string | null
          source_title: string
          source_url: string
          started_at: string | null
          to_figure_name: string
          to_figure_slug: string
          updated_at: string
          verification_notes: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          ended_at?: string | null
          from_figure_name: string
          from_figure_slug: string
          id?: string
          published?: boolean
          relationship_type: string
          source_publisher?: string | null
          source_title: string
          source_url: string
          started_at?: string | null
          to_figure_name: string
          to_figure_slug: string
          updated_at?: string
          verification_notes?: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          ended_at?: string | null
          from_figure_name?: string
          from_figure_slug?: string
          id?: string
          published?: boolean
          relationship_type?: string
          source_publisher?: string | null
          source_title?: string
          source_url?: string
          started_at?: string | null
          to_figure_name?: string
          to_figure_slug?: string
          updated_at?: string
          verification_notes?: string
          verification_status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      saved_figures: {
        Row: {
          created_at: string
          id: string
          slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      exec_sql: { Args: { sql_text: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "member"],
    },
  },
} as const
