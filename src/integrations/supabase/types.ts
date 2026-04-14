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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          doctor_id: string
          fee_paid: number | null
          id: string
          notes: string | null
          patient_id: string
          queue_position: number | null
          status: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          doctor_id: string
          fee_paid?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          queue_position?: number | null
          status?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          doctor_id?: string
          fee_paid?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          queue_position?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          message: string
          patient_id: string
          status: string
          subject: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message: string
          patient_id: string
          status?: string
          subject: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          patient_id?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_emergency: boolean | null
          bio: string | null
          city: string | null
          created_at: string | null
          district: string | null
          experience_years: number | null
          fee: number | null
          id: string
          is_approved: boolean | null
          is_frozen: boolean | null
          rating: number | null
          rating_count: number | null
          specialization: string | null
          status: string | null
          total_patients: number | null
          village: string | null
          visible_fields: Json | null
        }
        Insert: {
          available_emergency?: boolean | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          district?: string | null
          experience_years?: number | null
          fee?: number | null
          id: string
          is_approved?: boolean | null
          is_frozen?: boolean | null
          rating?: number | null
          rating_count?: number | null
          specialization?: string | null
          status?: string | null
          total_patients?: number | null
          village?: string | null
          visible_fields?: Json | null
        }
        Update: {
          available_emergency?: boolean | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          district?: string | null
          experience_years?: number | null
          fee?: number | null
          id?: string
          is_approved?: boolean | null
          is_frozen?: boolean | null
          rating?: number | null
          rating_count?: number | null
          specialization?: string | null
          status?: string | null
          total_patients?: number | null
          village?: string | null
          visible_fields?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favourites: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          patient_id: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          patient_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourites_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favourites_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string | null
          sender_id: string | null
          title: string
          type: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          title: string
          type?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          city: string | null
          created_at: string | null
          district: string | null
          id: string
          village: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          district?: string | null
          id: string
          village?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
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
      app_role: ["patient", "doctor", "admin"],
    },
  },
} as const
