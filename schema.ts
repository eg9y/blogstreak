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
      blogs: {
        Row: {
          created_at: string
          id: number
          is_published: boolean
          text: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_published?: boolean
          text: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_published?: boolean
          text?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_blogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      journal_sections: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: number
          journal_id: number
          token_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: number
          journal_id: number
          token_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: number
          journal_id?: number
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_sections_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: number
          notes_folders_id: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: number
          notes_folders_id: number
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          notes_folders_id?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_folders_id_fkey"
            columns: ["notes_folders_id"]
            isOneToOne: false
            referencedRelation: "notes_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_folders: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_topics: {
        Row: {
          created_at: string
          id: number
          post_id: number | null
          topic_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: number | null
          topic_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number | null
          topic_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_topics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_topics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          id: number
          is_public: boolean
          text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_public?: boolean
          text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_public?: boolean
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          email: string | null
          id: number
          name: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          email?: string | null
          id?: never
          name?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          email?: string | null
          id?: never
          name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          color: string
          created_at: string
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          color: string
          created_at?: string
          id?: number
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: number
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_user_id_fkey"
            columns: ["user_id"]
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
      get_blogs: {
        Args: {
          user_id_param: string
          is_published_param?: boolean
          earliest_blog_id_param?: number
        }
        Returns: {
          created_at: string
          id: number
          is_published: boolean
          text: string
          title: string
        }[]
      }
      get_notes:
        | {
            Args: {
              user_id_param: string
              earliest_note_id_param?: number
            }
            Returns: {
              created_at: string
              id: number
              content: string
              title: string
            }[]
          }
        | {
            Args: {
              user_id_param: string
              notes_folder_id_param: number
              earliest_note_id_param?: number
            }
            Returns: {
              created_at: string
              id: number
              content: string
              title: string
            }[]
          }
      get_posts_by_topics: {
        Args: {
          topic_names_arr?: string[]
          user_id_param?: string
          earliest_post_id_param?: number
          total_posts_param?: number
          username_param?: string
          is_private_param?: boolean
          month_param?: number
          year_param?: number
        }
        Returns: {
          post_id: number
          post_created_at: string
          post_text: string
          post_user_id: string
          post_topics: Json
          is_public: boolean
        }[]
      }
      get_posts_dates: {
        Args: {
          username_param: string
          month_param: number
          year_param: number
          user_id_param?: string
        }
        Returns: {
          post_id: number
          post_date: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
