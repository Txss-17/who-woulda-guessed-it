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
      ai_usage_history: {
        Row: {
          id: number
          parameters: string | null
          session_id: number
          usage_timestamp: string | null
        }
        Insert: {
          id?: never
          parameters?: string | null
          session_id: number
          usage_timestamp?: string | null
        }
        Update: {
          id?: never
          parameters?: string | null
          session_id?: number
          usage_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_ia"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_games: {
        Row: {
          archived_at: string | null
          final_statistics: Json | null
          game_id: number
          id: number
        }
        Insert: {
          archived_at?: string | null
          final_statistics?: Json | null
          game_id: number
          id?: never
        }
        Update: {
          archived_at?: string | null
          final_statistics?: Json | null
          game_id?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "archived_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_questions: {
        Row: {
          archived_at: string | null
          id: number
          question_id: number
        }
        Insert: {
          archived_at?: string | null
          id?: never
          question_id: number
        }
        Update: {
          archived_at?: string | null
          id?: never
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "archived_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country_id: number | null
          id: number
          name: string
        }
        Insert: {
          country_id?: number | null
          id?: never
          name: string
        }
        Update: {
          country_id?: number | null
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      game_players: {
        Row: {
          game_id: number | null
          id: number
          pseudo_temporaire: string | null
          score: number | null
          user_id: string | null
          vote_status: boolean | null
        }
        Insert: {
          game_id?: number | null
          id?: never
          pseudo_temporaire?: string | null
          score?: number | null
          user_id?: string | null
          vote_status?: boolean | null
        }
        Update: {
          game_id?: number | null
          id?: never
          pseudo_temporaire?: string | null
          score?: number | null
          user_id?: string | null
          vote_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "game_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          code_invitation: string
          date_creation: string | null
          host_user_id: string | null
          id: number
          mode: string
          statut: string
          type_jeu: string
        }
        Insert: {
          code_invitation: string
          date_creation?: string | null
          host_user_id?: string | null
          id?: never
          mode: string
          statut: string
          type_jeu: string
        }
        Update: {
          code_invitation?: string
          date_creation?: string | null
          host_user_id?: string | null
          id?: never
          mode?: string
          statut?: string
          type_jeu?: string
        }
        Relationships: [
          {
            foreignKeyName: "parties_host_user_id_fkey"
            columns: ["host_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          contenu: string
          cree_par_ia: boolean
          cree_par_user_id: string | null
          id: number
          is_public: boolean
          langue: string | null
          type_jeu: string
        }
        Insert: {
          contenu: string
          cree_par_ia: boolean
          cree_par_user_id?: string | null
          id?: never
          is_public?: boolean
          langue?: string | null
          type_jeu: string
        }
        Update: {
          contenu?: string
          cree_par_ia?: boolean
          cree_par_user_id?: string | null
          id?: never
          is_public?: boolean
          langue?: string | null
          type_jeu?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_cree_par_user_id_fkey"
            columns: ["cree_par_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions_ia: {
        Row: {
          game_id: number | null
          id: number
          parametres_ia: string
          question_generee: string | null
          timestamp: string | null
        }
        Insert: {
          game_id?: number | null
          id?: never
          parametres_ia: string
          question_generee?: string | null
          timestamp?: string | null
        }
        Update: {
          game_id?: number | null
          id?: never
          parametres_ia?: string
          question_generee?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_ia_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          date_creation: string | null
          dernier_login: string | null
          email: string | null
          id: string
          langue: string | null
          pseudo: string
        }
        Insert: {
          avatar_url?: string | null
          date_creation?: string | null
          dernier_login?: string | null
          email?: string | null
          id?: string
          langue?: string | null
          pseudo: string
        }
        Update: {
          avatar_url?: string | null
          date_creation?: string | null
          dernier_login?: string | null
          email?: string | null
          id?: string
          langue?: string | null
          pseudo?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          game_id: number | null
          id: number
          question_id: number | null
          voted_by_user_id: string | null
          voted_for_user_id: string | null
        }
        Insert: {
          game_id?: number | null
          id?: never
          question_id?: number | null
          voted_by_user_id?: string | null
          voted_for_user_id?: string | null
        }
        Update: {
          game_id?: number | null
          id?: never
          question_id?: number | null
          voted_by_user_id?: string | null
          voted_for_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voted_by_user_id_fkey"
            columns: ["voted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voted_for_user_id_fkey"
            columns: ["voted_for_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
