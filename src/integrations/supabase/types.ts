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
          appointment_time: string
          created_at: string
          doctor_profile_id: string
          fee_snapshot: number | null
          id: string
          notes: string | null
          patient_profile_id: string
          status: Database["public"]["Enums"]["appointment_status"]
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_profile_id: string
          fee_snapshot?: number | null
          id?: string
          notes?: string | null
          patient_profile_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_profile_id?: string
          fee_snapshot?: number | null
          id?: string
          notes?: string | null
          patient_profile_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_profile_id_fkey"
            columns: ["doctor_profile_id"]
            isOneToOne: false
            referencedRelation: "doctor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_profile_id_fkey"
            columns: ["patient_profile_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string
          patient_profile_id: string
          status: Database["public"]["Enums"]["complaint_status"]
          subject: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message: string
          patient_profile_id: string
          status?: Database["public"]["Enums"]["complaint_status"]
          subject: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string
          patient_profile_id?: string
          status?: Database["public"]["Enums"]["complaint_status"]
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_patient_profile_id_fkey"
            columns: ["patient_profile_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          availability_status: Database["public"]["Enums"]["availability_status"]
          available_in_emergency: boolean | null
          bio: string | null
          city: string | null
          clinic_name: string | null
          consultation_fee: number | null
          created_at: string
          district: string | null
          id: string
          license_number: string | null
          patients_checked_count: number | null
          profile_id: string
          profile_photo_url: string | null
          qualification: string | null
          show_email_to_patients: boolean | null
          show_experience_to_patients: boolean | null
          show_fee_to_patients: boolean | null
          show_phone_to_patients: boolean | null
          show_qualification_to_patients: boolean | null
          specialization: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          years_of_experience: number | null
        }
        Insert: {
          availability_status?: Database["public"]["Enums"]["availability_status"]
          available_in_emergency?: boolean | null
          bio?: string | null
          city?: string | null
          clinic_name?: string | null
          consultation_fee?: number | null
          created_at?: string
          district?: string | null
          id?: string
          license_number?: string | null
          patients_checked_count?: number | null
          profile_id: string
          profile_photo_url?: string | null
          qualification?: string | null
          show_email_to_patients?: boolean | null
          show_experience_to_patients?: boolean | null
          show_fee_to_patients?: boolean | null
          show_phone_to_patients?: boolean | null
          show_qualification_to_patients?: boolean | null
          specialization?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          years_of_experience?: number | null
        }
        Update: {
          availability_status?: Database["public"]["Enums"]["availability_status"]
          available_in_emergency?: boolean | null
          bio?: string | null
          city?: string | null
          clinic_name?: string | null
          consultation_fee?: number | null
          created_at?: string
          district?: string | null
          id?: string
          license_number?: string | null
          patients_checked_count?: number | null
          profile_id?: string
          profile_photo_url?: string | null
          qualification?: string | null
          show_email_to_patients?: boolean | null
          show_experience_to_patients?: boolean | null
          show_fee_to_patients?: boolean | null
          show_phone_to_patients?: boolean | null
          show_qualification_to_patients?: boolean | null
          specialization?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          type?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          doctor_profile_id: string
          id: string
          patient_profile_id: string
        }
        Insert: {
          created_at?: string
          doctor_profile_id: string
          id?: string
          patient_profile_id: string
        }
        Update: {
          created_at?: string
          doctor_profile_id?: string
          id?: string
          patient_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_doctor_profile_id_fkey"
            columns: ["doctor_profile_id"]
            isOneToOne: false
            referencedRelation: "doctor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_patient_profile_id_fkey"
            columns: ["patient_profile_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          target_profile_id: string | null
          target_role: Database["public"]["Enums"]["notification_target"]
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          target_profile_id?: string | null
          target_role?: Database["public"]["Enums"]["notification_target"]
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          target_profile_id?: string | null
          target_role?: Database["public"]["Enums"]["notification_target"]
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          created_at: string
          district: string | null
          id: string
          notifications_enabled: boolean | null
          profile_id: string
          theme_preference: string | null
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          id?: string
          notifications_enabled?: boolean | null
          profile_id: string
          theme_preference?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          id?: string
          notifications_enabled?: boolean | null
          profile_id?: string
          theme_preference?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_profiles_profile_id_fkey"
            columns: ["profile_id"]
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
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
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
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
      appointment_status:
        | "pending_confirmation"
        | "confirmed"
        | "in_queue"
        | "called"
        | "completed"
        | "cancelled"
      availability_status: "available" | "busy" | "away" | "offline"
      complaint_status: "open" | "in_progress" | "resolved"
      notification_target: "patient" | "doctor" | "both"
      verification_status: "pending" | "approved" | "rejected" | "frozen"
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
      appointment_status: [
        "pending_confirmation",
        "confirmed",
        "in_queue",
        "called",
        "completed",
        "cancelled",
      ],
      availability_status: ["available", "busy", "away", "offline"],
      complaint_status: ["open", "in_progress", "resolved"],
      notification_target: ["patient", "doctor", "both"],
      verification_status: ["pending", "approved", "rejected", "frozen"],
    },
  },
} as const
