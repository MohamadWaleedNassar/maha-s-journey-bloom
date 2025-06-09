export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budget_goals: {
        Row: {
          amount: number
          budget_type: string
          category_id: string | null
          created_at: string
          end_date: string
          id: string
          period: string
          start_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          budget_type?: string
          category_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          period: string
          start_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_type?: string
          category_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          period?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_goals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          budget: number
          color: string
          created_at: string
          icon: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          budget?: number
          color: string
          created_at?: string
          icon: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          budget?: number
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      chemo_sessions: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          feeling_rating: number | null
          id: string
          image_url: string | null
          notes: string | null
          session_number: number
          side_effects: Json | null
          stage_number: number
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          feeling_rating?: number | null
          id?: string
          image_url?: string | null
          notes?: string | null
          session_number: number
          side_effects?: Json | null
          stage_number: number
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          feeling_rating?: number | null
          id?: string
          image_url?: string | null
          notes?: string | null
          session_number?: number
          side_effects?: Json | null
          stage_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          date: string
          id: string
          image_url: string | null
          mood: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          date: string
          id?: string
          image_url?: string | null
          mood?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: string
          image_url?: string | null
          mood?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          id: string
          name: string
          notes: string | null
          schedule: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          schedule: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          schedule?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          image_url: string
          notes: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          image_url: string
          notes?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string
          notes?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read_status: boolean
          sent_by: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_status?: boolean
          sent_by?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_status?: boolean
          sent_by?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      ogt_approvals: {
        Row: {
          collection_method: string
          contract_pdf_url: string
          created_at: string
          division_id: string
          id: string
          money_collected: number
          payment_proof_url: string
          project_id: string
          status: string
          tp_id: string
          tp_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_method: string
          contract_pdf_url: string
          created_at?: string
          division_id: string
          id?: string
          money_collected: number
          payment_proof_url: string
          project_id: string
          status?: string
          tp_id: string
          tp_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_method?: string
          contract_pdf_url?: string
          created_at?: string
          division_id?: string
          id?: string
          money_collected?: number
          payment_proof_url?: string
          project_id?: string
          status?: string
          tp_id?: string
          tp_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ogv_approvals: {
        Row: {
          collection_method: string
          contract_pdf_url: string
          created_at: string
          division_id: string
          ep_id: string
          ep_name: string
          id: string
          money_collected: number
          opp_id: string
          payment_proof_url: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_method: string
          contract_pdf_url: string
          created_at?: string
          division_id: string
          ep_id: string
          ep_name: string
          id?: string
          money_collected: number
          opp_id: string
          payment_proof_url: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_method?: string
          contract_pdf_url?: string
          created_at?: string
          division_id?: string
          ep_id?: string
          ep_name?: string
          id?: string
          money_collected?: number
          opp_id?: string
          payment_proof_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ogv_approvals_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "ogx_divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      ogx_divisions: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_division_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_division_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_division_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ogx_divisions_parent_division_id_fkey"
            columns: ["parent_division_id"]
            isOneToOne: false
            referencedRelation: "ogx_divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      stage_scans: {
        Row: {
          created_at: string
          date: string
          doctor_notes: string | null
          id: string
          image_url: string | null
          stage_number: number
          summary: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          doctor_notes?: string | null
          id?: string
          image_url?: string | null
          stage_number: number
          summary: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_notes?: string | null
          id?: string
          image_url?: string | null
          stage_number?: number
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          date: string
          description: string
          id: string
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_stages: {
        Row: {
          created_at: string
          id: string
          sessions_per_stage: number
          stage_description: string | null
          stage_name: string | null
          stage_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          sessions_per_stage?: number
          stage_description?: string | null
          stage_name?: string | null
          stage_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sessions_per_stage?: number
          stage_description?: string | null
          stage_name?: string | null
          stage_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      video_calls: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          room_id: string
          started_at: string | null
          started_by: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          room_id: string
          started_at?: string | null
          started_by: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          room_id?: string
          started_at?: string | null
          started_by?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
