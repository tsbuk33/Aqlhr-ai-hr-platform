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
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          overtime_hours: number | null
          status: string | null
          total_hours: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cr_number: string | null
          created_at: string | null
          id: string
          industry: string | null
          language_preference: string | null
          name: string
          rtl_enabled: boolean | null
          saudization_target: number | null
          size_category: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          cr_number?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          language_preference?: string | null
          name: string
          rtl_enabled?: boolean | null
          saudization_target?: number | null
          size_category?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          cr_number?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          language_preference?: string | null
          name?: string
          rtl_enabled?: boolean | null
          saudization_target?: number | null
          size_category?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string | null
          employee_number: string
          first_name: string
          first_name_ar: string | null
          hire_date: string | null
          id: string
          iqama_number: string | null
          is_saudi: boolean | null
          last_name: string
          last_name_ar: string | null
          national_id: string | null
          nationality: string | null
          phone: string | null
          position: string | null
          position_ar: string | null
          salary: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_number: string
          first_name: string
          first_name_ar?: string | null
          hire_date?: string | null
          id?: string
          iqama_number?: string | null
          is_saudi?: boolean | null
          last_name: string
          last_name_ar?: string | null
          national_id?: string | null
          nationality?: string | null
          phone?: string | null
          position?: string | null
          position_ar?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_number?: string
          first_name?: string
          first_name_ar?: string | null
          hire_date?: string | null
          id?: string
          iqama_number?: string | null
          is_saudi?: boolean | null
          last_name?: string
          last_name_ar?: string | null
          national_id?: string | null
          nationality?: string | null
          phone?: string | null
          position?: string | null
          position_ar?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      gov_integration_status: {
        Row: {
          api_key_encrypted: string | null
          company_id: string | null
          config: Json | null
          created_at: string | null
          id: string
          integration_type: string
          last_sync: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          integration_type: string
          last_sync?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          integration_type?: string
          last_sync?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gov_integration_status_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          days_requested: number
          employee_id: string | null
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          days_requested: number
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          days_requested?: number
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          allowances: number | null
          basic_salary: number
          company_id: string | null
          created_at: string | null
          deductions: number | null
          employee_id: string | null
          gosi_employee: number | null
          gosi_employer: number | null
          id: string
          month: number
          net_salary: number
          overtime: number | null
          processed_at: string | null
          wps_status: string | null
          year: number
        }
        Insert: {
          allowances?: number | null
          basic_salary: number
          company_id?: string | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          gosi_employee?: number | null
          gosi_employer?: number | null
          id?: string
          month: number
          net_salary: number
          overtime?: number | null
          processed_at?: string | null
          wps_status?: string | null
          year: number
        }
        Update: {
          allowances?: number | null
          basic_salary?: number
          company_id?: string | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          gosi_employee?: number | null
          gosi_employer?: number | null
          id?: string
          month?: number
          net_salary?: number
          overtime?: number | null
          processed_at?: string | null
          wps_status?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          achievements: Json | null
          created_at: string | null
          employee_id: string | null
          goals: Json | null
          id: string
          kpis: Json | null
          overall_rating: number | null
          review_period: string
          reviewer_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          achievements?: Json | null
          created_at?: string | null
          employee_id?: string | null
          goals?: Json | null
          id?: string
          kpis?: Json | null
          overall_rating?: number | null
          review_period: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          achievements?: Json | null
          created_at?: string | null
          employee_id?: string | null
          goals?: Json | null
          id?: string
          kpis?: Json | null
          overall_rating?: number | null
          review_period?: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      training_records: {
        Row: {
          certificate_url: string | null
          course_name: string
          course_name_ar: string | null
          created_at: string | null
          employee_id: string | null
          end_date: string | null
          hours: number | null
          id: string
          provider: string | null
          start_date: string | null
          status: string | null
          tvtc_integrated: boolean | null
        }
        Insert: {
          certificate_url?: string | null
          course_name: string
          course_name_ar?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          hours?: number | null
          id?: string
          provider?: string | null
          start_date?: string | null
          status?: string | null
          tvtc_integrated?: boolean | null
        }
        Update: {
          certificate_url?: string | null
          course_name?: string
          course_name_ar?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          hours?: number | null
          id?: string
          provider?: string | null
          start_date?: string | null
          status?: string | null
          tvtc_integrated?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "training_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
