export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
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
      badges: {
        Row: {
          condition_type: string
          condition_value: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          rarity: string | null
        }
        Insert: {
          condition_type: string
          condition_value?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          rarity?: string | null
        }
        Update: {
          condition_type?: string
          condition_value?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          rarity?: string | null
        }
        Relationships: []
      }
      categories_questions: {
        Row: {
          age_minimum: number | null
          couleur: string | null
          description: string | null
          icone: string | null
          id: number
          nom: string
        }
        Insert: {
          age_minimum?: number | null
          couleur?: string | null
          description?: string | null
          icone?: string | null
          id?: number
          nom: string
        }
        Update: {
          age_minimum?: number | null
          couleur?: string | null
          description?: string | null
          icone?: string | null
          id?: number
          nom?: string
        }
        Relationships: []
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
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      leaderboards: {
        Row: {
          category: string
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          rank: number | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          message_type: string | null
          party_id: number | null
          read_at: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          message_type?: string | null
          party_id?: number | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          message_type?: string | null
          party_id?: number | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          notification_type: string
          read: boolean | null
          related_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          notification_type: string
          read?: boolean | null
          related_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          notification_type?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          allow_join_after_start: boolean | null
          anonymous_voting: boolean | null
          anti_cheat_enabled: boolean | null
          code_invitation: string
          date_creation: string | null
          host_user_id: string | null
          id: number
          invite_link: string | null
          max_players: number | null
          mode: string
          number_of_rounds: number | null
          party_password: string | null
          party_type: Database["public"]["Enums"]["party_type"] | null
          password_protected: boolean | null
          settings: Json | null
          statut: string
          time_per_turn: number | null
          type_jeu: string
        }
        Insert: {
          allow_join_after_start?: boolean | null
          anonymous_voting?: boolean | null
          anti_cheat_enabled?: boolean | null
          code_invitation: string
          date_creation?: string | null
          host_user_id?: string | null
          id?: never
          invite_link?: string | null
          max_players?: number | null
          mode: string
          number_of_rounds?: number | null
          party_password?: string | null
          party_type?: Database["public"]["Enums"]["party_type"] | null
          password_protected?: boolean | null
          settings?: Json | null
          statut: string
          time_per_turn?: number | null
          type_jeu: string
        }
        Update: {
          allow_join_after_start?: boolean | null
          anonymous_voting?: boolean | null
          anti_cheat_enabled?: boolean | null
          code_invitation?: string
          date_creation?: string | null
          host_user_id?: string | null
          id?: never
          invite_link?: string | null
          max_players?: number | null
          mode?: string
          number_of_rounds?: number | null
          party_password?: string | null
          party_type?: Database["public"]["Enums"]["party_type"] | null
          password_protected?: boolean | null
          settings?: Json | null
          statut?: string
          time_per_turn?: number | null
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
      party_invitations: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          invite_code: string
          invitee_id: string | null
          inviter_id: string | null
          party_id: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invite_code: string
          invitee_id?: string | null
          inviter_id?: string | null
          party_id?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invite_code?: string
          invitee_id?: string | null
          inviter_id?: string | null
          party_id?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "party_invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_invitations_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: Json | null
          bio: string | null
          date_creation: string | null
          derniere_connexion: string | null
          email: string | null
          experience: number | null
          id: string
          niveau: number | null
          parties_jouees: number | null
          pseudo: string
          votes_donnes: number | null
          votes_recus: number | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: Json | null
          bio?: string | null
          date_creation?: string | null
          derniere_connexion?: string | null
          email?: string | null
          experience?: number | null
          id: string
          niveau?: number | null
          parties_jouees?: number | null
          pseudo: string
          votes_donnes?: number | null
          votes_recus?: number | null
        }
        Update: {
          avatar_url?: string | null
          badges?: Json | null
          bio?: string | null
          date_creation?: string | null
          derniere_connexion?: string | null
          email?: string | null
          experience?: number | null
          id?: string
          niveau?: number | null
          parties_jouees?: number | null
          pseudo?: string
          votes_donnes?: number | null
          votes_recus?: number | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          age_minimum: number | null
          categorie_id: number | null
          contenu: string
          contenu_sensible: boolean | null
          cree_par_ia: boolean
          cree_par_user_id: string | null
          id: number
          is_public: boolean
          langue: string | null
          tags: string[] | null
          type_jeu: string
        }
        Insert: {
          age_minimum?: number | null
          categorie_id?: number | null
          contenu: string
          contenu_sensible?: boolean | null
          cree_par_ia: boolean
          cree_par_user_id?: string | null
          id?: never
          is_public?: boolean
          langue?: string | null
          tags?: string[] | null
          type_jeu: string
        }
        Update: {
          age_minimum?: number | null
          categorie_id?: number | null
          contenu?: string
          contenu_sensible?: boolean | null
          cree_par_ia?: boolean
          cree_par_user_id?: string | null
          id?: never
          is_public?: boolean
          langue?: string | null
          tags?: string[] | null
          type_jeu?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_cree_par_user_id_fkey"
            columns: ["cree_par_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      realtime_games: {
        Row: {
          code: string
          created_at: string | null
          current_question: number | null
          game_type: string | null
          host_id: string | null
          host_name: string
          id: string
          max_players: number | null
          players: Json | null
          questions: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_question?: number | null
          game_type?: string | null
          host_id?: string | null
          host_name: string
          id?: string
          max_players?: number | null
          players?: Json | null
          questions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_question?: number | null
          game_type?: string | null
          host_id?: string | null
          host_name?: string
          id?: string
          max_players?: number | null
          players?: Json | null
          questions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      round_votes: {
        Row: {
          created_at: string
          game_id: number
          id: number
          question_index: number
          question_text: string | null
          target_player_id: number
          voter_player_id: number
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          question_index: number
          question_text?: string | null
          target_player_id: number
          voter_player_id: number
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          question_index?: number
          question_text?: string | null
          target_player_id?: number
          voter_player_id?: number
        }
        Relationships: []
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
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_statistics: {
        Row: {
          created_at: string | null
          id: string
          period: string | null
          stat_type: string
          stat_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          period?: string | null
          stat_type: string
          stat_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          period?: string | null
          stat_type?: string
          stat_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_statistics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      check_and_award_badges: {
        Args: Record<PropertyKey, never> | { user_uuid: string }
        Returns: undefined
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_user_stats: {
        Args:
          | Record<PropertyKey, never>
          | { user_uuid: string; stat_name: string; increment_value?: number }
        Returns: undefined
      }
    }
    Enums: {
      party_status: "waiting" | "playing" | "finished" | "cancelled"
      party_type: "private" | "public" | "mixed"
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
      party_status: ["waiting", "playing", "finished", "cancelled"],
      party_type: ["private", "public", "mixed"],
    },
  },
} as const
