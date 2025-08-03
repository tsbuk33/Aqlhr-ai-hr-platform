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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          embedding: number[]
          end_position: number | null
          id: string
          metadata: Json | null
          start_position: number | null
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          embedding: number[]
          end_position?: number | null
          id?: string
          metadata?: Json | null
          start_position?: number | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          embedding?: number[]
          end_position?: number | null
          id?: string
          metadata?: Json | null
          start_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "ai_document_embeddings"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_document_embeddings: {
        Row: {
          company_id: string | null
          created_at: string
          file_name: string
          file_url: string
          id: string
          metadata: Json | null
          module_key: string | null
          processed_content: string | null
          processing_status: string | null
          total_chunks: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          metadata?: Json | null
          module_key?: string | null
          processed_content?: string | null
          processing_status?: string | null
          total_chunks?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          module_key?: string | null
          processed_content?: string | null
          processing_status?: string | null
          total_chunks?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_document_processing: {
        Row: {
          company_id: string | null
          confidence_score: number | null
          created_at: string | null
          document_type: string
          error_message: string | null
          extracted_data: Json | null
          file_name: string
          file_url: string | null
          id: string
          language_detected: string | null
          processed_at: string | null
          processing_status: string | null
          processing_time_ms: number | null
        }
        Insert: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_type: string
          error_message?: string | null
          extracted_data?: Json | null
          file_name: string
          file_url?: string | null
          id?: string
          language_detected?: string | null
          processed_at?: string | null
          processing_status?: string | null
          processing_time_ms?: number | null
        }
        Update: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_type?: string
          error_message?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_url?: string | null
          id?: string
          language_detected?: string | null
          processed_at?: string | null
          processing_status?: string | null
          processing_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_document_processing_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_knowledge_base: {
        Row: {
          category: string
          company_id: string | null
          content_ar: string | null
          content_en: string
          created_at: string | null
          government_agency: string | null
          helpful_votes: number | null
          id: string
          is_active: boolean | null
          keywords_ar: string[] | null
          keywords_en: string[] | null
          last_reviewed_at: string | null
          law_article: string | null
          module_name: string | null
          regulation_reference: string | null
          review_required: boolean | null
          reviewed_by: string | null
          search_count: number | null
          subcategory: string | null
          title_ar: string | null
          title_en: string
          unhelpful_votes: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          content_ar?: string | null
          content_en: string
          created_at?: string | null
          government_agency?: string | null
          helpful_votes?: number | null
          id?: string
          is_active?: boolean | null
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_reviewed_at?: string | null
          law_article?: string | null
          module_name?: string | null
          regulation_reference?: string | null
          review_required?: boolean | null
          reviewed_by?: string | null
          search_count?: number | null
          subcategory?: string | null
          title_ar?: string | null
          title_en: string
          unhelpful_votes?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          content_ar?: string | null
          content_en?: string
          created_at?: string | null
          government_agency?: string | null
          helpful_votes?: number | null
          id?: string
          is_active?: boolean | null
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_reviewed_at?: string | null
          law_article?: string | null
          module_name?: string | null
          regulation_reference?: string | null
          review_required?: boolean | null
          reviewed_by?: string | null
          search_count?: number | null
          subcategory?: string | null
          title_ar?: string | null
          title_en?: string
          unhelpful_votes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_predictions: {
        Row: {
          company_id: string | null
          confidence_interval: Json | null
          created_at: string | null
          employee_id: string | null
          expires_at: string | null
          id: string
          influencing_factors: Json
          model_type: string
          model_version: string | null
          prediction_date: string | null
          prediction_score: number
          risk_level: string
        }
        Insert: {
          company_id?: string | null
          confidence_interval?: Json | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          influencing_factors: Json
          model_type: string
          model_version?: string | null
          prediction_date?: string | null
          prediction_score: number
          risk_level: string
        }
        Update: {
          company_id?: string | null
          confidence_interval?: Json | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          influencing_factors?: Json
          model_type?: string
          model_version?: string | null
          prediction_date?: string | null
          prediction_score?: number
          risk_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_predictions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          company_id: string | null
          confidence_score: number | null
          created_at: string | null
          employee_id: string | null
          id: string
          implementation_deadline: string | null
          priority: string | null
          reasoning: string
          recommendation_type: string
          recommended_action: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          implementation_deadline?: string | null
          priority?: string | null
          reasoning: string
          recommendation_type: string
          recommended_action: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          implementation_deadline?: string | null
          priority?: string | null
          reasoning?: string
          recommendation_type?: string
          recommended_action?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_sync_events: {
        Row: {
          affected_modules: string[]
          company_id: string | null
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          source_record_id: string
          source_table: string
          sync_latency_ms: number | null
          sync_status: string | null
        }
        Insert: {
          affected_modules: string[]
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          source_record_id: string
          source_table: string
          sync_latency_ms?: number | null
          sync_status?: string | null
        }
        Update: {
          affected_modules?: string[]
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          source_record_id?: string
          source_table?: string
          sync_latency_ms?: number | null
          sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_sync_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tool_recommendations: {
        Row: {
          company_id: string | null
          confidence_score: number | null
          created_at: string | null
          expected_benefits: Json | null
          id: string
          implementation_complexity: string | null
          priority: string | null
          reasoning: string
          recommended_tool: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          tool_category: string
        }
        Insert: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          expected_benefits?: Json | null
          id?: string
          implementation_complexity?: string | null
          priority?: string | null
          reasoning: string
          recommended_tool: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          tool_category: string
        }
        Update: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          expected_benefits?: Json | null
          id?: string
          implementation_complexity?: string | null
          priority?: string | null
          reasoning?: string
          recommended_tool?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          tool_category?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tool_recommendations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          company_id: string | null
          created_at: string
          event_type: string
          id: string
          module_name: string
          properties: Json | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          module_name: string
          properties?: Json | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          module_name?: string
          properties?: Json | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          actual_hours: number | null
          approval_comments: string | null
          approval_date: string | null
          approved_by: string | null
          break_duration_minutes: number | null
          break_end_time: string | null
          break_start_time: string | null
          check_in: string | null
          check_out: string | null
          clock_in_location: string | null
          clock_out_location: string | null
          created_at: string | null
          date: string
          day_of_week: string | null
          early_departure_minutes: number | null
          employee_id: string | null
          employee_notes: string | null
          hijri_date: string | null
          id: string
          ip_address: unknown | null
          late_minutes: number | null
          manager_notes: string | null
          overtime_hours: number | null
          requires_approval: boolean | null
          scheduled_hours: number | null
          status: string | null
          total_hours: number | null
        }
        Insert: {
          actual_hours?: number | null
          approval_comments?: string | null
          approval_date?: string | null
          approved_by?: string | null
          break_duration_minutes?: number | null
          break_end_time?: string | null
          break_start_time?: string | null
          check_in?: string | null
          check_out?: string | null
          clock_in_location?: string | null
          clock_out_location?: string | null
          created_at?: string | null
          date: string
          day_of_week?: string | null
          early_departure_minutes?: number | null
          employee_id?: string | null
          employee_notes?: string | null
          hijri_date?: string | null
          id?: string
          ip_address?: unknown | null
          late_minutes?: number | null
          manager_notes?: string | null
          overtime_hours?: number | null
          requires_approval?: boolean | null
          scheduled_hours?: number | null
          status?: string | null
          total_hours?: number | null
        }
        Update: {
          actual_hours?: number | null
          approval_comments?: string | null
          approval_date?: string | null
          approved_by?: string | null
          break_duration_minutes?: number | null
          break_end_time?: string | null
          break_start_time?: string | null
          check_in?: string | null
          check_out?: string | null
          clock_in_location?: string | null
          clock_out_location?: string | null
          created_at?: string | null
          date?: string
          day_of_week?: string | null
          early_departure_minutes?: number | null
          employee_id?: string | null
          employee_notes?: string | null
          hijri_date?: string | null
          id?: string
          ip_address?: unknown | null
          late_minutes?: number | null
          manager_notes?: string | null
          overtime_hours?: number | null
          requires_approval?: boolean | null
          scheduled_hours?: number | null
          status?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_analytics: {
        Row: {
          analysis_date: string
          anomaly_flags: Json | null
          attendance_score: number | null
          company_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          leave_pattern: string | null
          overtime_trend: string | null
          productivity_correlation: number | null
          punctuality_score: number | null
          recommendations: Json | null
          risk_indicators: Json | null
        }
        Insert: {
          analysis_date: string
          anomaly_flags?: Json | null
          attendance_score?: number | null
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          leave_pattern?: string | null
          overtime_trend?: string | null
          productivity_correlation?: number | null
          punctuality_score?: number | null
          recommendations?: Json | null
          risk_indicators?: Json | null
        }
        Update: {
          analysis_date?: string
          anomaly_flags?: Json | null
          attendance_score?: number | null
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          leave_pattern?: string | null
          overtime_trend?: string | null
          productivity_correlation?: number | null
          punctuality_score?: number | null
          recommendations?: Json | null
          risk_indicators?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_analytics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_breaks: {
        Row: {
          break_end: string | null
          break_start: string
          break_type: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          session_id: string | null
        }
        Insert: {
          break_end?: string | null
          break_start: string
          break_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_id?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string
          break_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_breaks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mobile_attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_deductions: {
        Row: {
          approved_by: string | null
          company_id: string | null
          created_at: string | null
          date: string
          deduction_amount: number | null
          deduction_hours: number | null
          deduction_type: string
          employee_id: string | null
          id: string
          is_approved: boolean | null
          reason: string | null
          timesheet_id: string | null
        }
        Insert: {
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          date: string
          deduction_amount?: number | null
          deduction_hours?: number | null
          deduction_type: string
          employee_id?: string | null
          id?: string
          is_approved?: boolean | null
          reason?: string | null
          timesheet_id?: string | null
        }
        Update: {
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          date?: string
          deduction_amount?: number | null
          deduction_hours?: number | null
          deduction_type?: string
          employee_id?: string | null
          id?: string
          is_approved?: boolean | null
          reason?: string | null
          timesheet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_deductions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_deductions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_deductions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_deductions_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "attendance_timesheet"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_locations: {
        Row: {
          address: string
          company_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          name: string
          name_ar: string | null
          radius_meters: number | null
        }
        Insert: {
          address: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          name: string
          name_ar?: string | null
          radius_meters?: number | null
        }
        Update: {
          address?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          name_ar?: string | null
          radius_meters?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_timesheet: {
        Row: {
          actual_hours: number | null
          break_duration: number | null
          check_in_time: string | null
          check_out_time: string | null
          company_id: string | null
          created_at: string | null
          date: string
          device_info: Json | null
          early_departure_minutes: number | null
          employee_id: string | null
          id: string
          ip_address_in: unknown | null
          ip_address_out: unknown | null
          is_ramadan_schedule: boolean | null
          late_minutes: number | null
          location_check_in: string | null
          location_check_out: string | null
          notes: string | null
          overtime_hours: number | null
          planned_hours: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          break_duration?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          company_id?: string | null
          created_at?: string | null
          date: string
          device_info?: Json | null
          early_departure_minutes?: number | null
          employee_id?: string | null
          id?: string
          ip_address_in?: unknown | null
          ip_address_out?: unknown | null
          is_ramadan_schedule?: boolean | null
          late_minutes?: number | null
          location_check_in?: string | null
          location_check_out?: string | null
          notes?: string | null
          overtime_hours?: number | null
          planned_hours?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          break_duration?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          company_id?: string | null
          created_at?: string | null
          date?: string
          device_info?: Json | null
          early_departure_minutes?: number | null
          employee_id?: string | null
          id?: string
          ip_address_in?: unknown | null
          ip_address_out?: unknown | null
          is_ramadan_schedule?: boolean | null
          late_minutes?: number | null
          location_check_in?: string | null
          location_check_out?: string | null
          notes?: string | null
          overtime_hours?: number | null
          planned_hours?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_timesheet_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_timesheet_employee_id_fkey"
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
      benefit_plans: {
        Row: {
          annual_premium: number | null
          benefit_type: string | null
          child_coverage_cost: number | null
          company_id: string
          coverage_amount: number | null
          coverage_details_arabic: string | null
          coverage_details_english: string | null
          created_at: string | null
          description_arabic: string | null
          description_english: string | null
          effective_from_date: string
          effective_to_date: string | null
          eligibility_criteria_arabic: string | null
          eligibility_criteria_english: string | null
          employee_contribution_percentage: number | null
          employer_contribution_percentage: number | null
          family_coverage_available: boolean | null
          id: string
          min_service_months: number | null
          monthly_premium: number | null
          plan_code: string | null
          plan_name_arabic: string
          plan_name_english: string
          policy_number: string | null
          provider_contact: string | null
          provider_name: string | null
          spouse_coverage_cost: number | null
          status: string | null
          updated_at: string | null
          waiting_period_months: number | null
        }
        Insert: {
          annual_premium?: number | null
          benefit_type?: string | null
          child_coverage_cost?: number | null
          company_id: string
          coverage_amount?: number | null
          coverage_details_arabic?: string | null
          coverage_details_english?: string | null
          created_at?: string | null
          description_arabic?: string | null
          description_english?: string | null
          effective_from_date: string
          effective_to_date?: string | null
          eligibility_criteria_arabic?: string | null
          eligibility_criteria_english?: string | null
          employee_contribution_percentage?: number | null
          employer_contribution_percentage?: number | null
          family_coverage_available?: boolean | null
          id?: string
          min_service_months?: number | null
          monthly_premium?: number | null
          plan_code?: string | null
          plan_name_arabic: string
          plan_name_english: string
          policy_number?: string | null
          provider_contact?: string | null
          provider_name?: string | null
          spouse_coverage_cost?: number | null
          status?: string | null
          updated_at?: string | null
          waiting_period_months?: number | null
        }
        Update: {
          annual_premium?: number | null
          benefit_type?: string | null
          child_coverage_cost?: number | null
          company_id?: string
          coverage_amount?: number | null
          coverage_details_arabic?: string | null
          coverage_details_english?: string | null
          created_at?: string | null
          description_arabic?: string | null
          description_english?: string | null
          effective_from_date?: string
          effective_to_date?: string | null
          eligibility_criteria_arabic?: string | null
          eligibility_criteria_english?: string | null
          employee_contribution_percentage?: number | null
          employer_contribution_percentage?: number | null
          family_coverage_available?: boolean | null
          id?: string
          min_service_months?: number | null
          monthly_premium?: number | null
          plan_code?: string | null
          plan_name_arabic?: string
          plan_name_english?: string
          policy_number?: string | null
          provider_contact?: string | null
          provider_name?: string | null
          spouse_coverage_cost?: number | null
          status?: string | null
          updated_at?: string | null
          waiting_period_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "benefit_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          business_type: string | null
          company_name_arabic: string | null
          cr_number: string | null
          created_at: string | null
          employee_count_range: string | null
          gosi_establishment_number: string | null
          headquarters_address_arabic: string | null
          headquarters_address_english: string | null
          id: string
          industry: string | null
          language_preference: string | null
          mol_establishment_number: string | null
          name: string
          nitaqat_certificate_number: string | null
          nitaqat_status: string | null
          rtl_enabled: boolean | null
          saudization_percentage: number | null
          saudization_target: number | null
          size_category: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          business_type?: string | null
          company_name_arabic?: string | null
          cr_number?: string | null
          created_at?: string | null
          employee_count_range?: string | null
          gosi_establishment_number?: string | null
          headquarters_address_arabic?: string | null
          headquarters_address_english?: string | null
          id?: string
          industry?: string | null
          language_preference?: string | null
          mol_establishment_number?: string | null
          name: string
          nitaqat_certificate_number?: string | null
          nitaqat_status?: string | null
          rtl_enabled?: boolean | null
          saudization_percentage?: number | null
          saudization_target?: number | null
          size_category?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          business_type?: string | null
          company_name_arabic?: string | null
          cr_number?: string | null
          created_at?: string | null
          employee_count_range?: string | null
          gosi_establishment_number?: string | null
          headquarters_address_arabic?: string | null
          headquarters_address_english?: string | null
          id?: string
          industry?: string | null
          language_preference?: string | null
          mol_establishment_number?: string | null
          name?: string
          nitaqat_certificate_number?: string | null
          nitaqat_status?: string | null
          rtl_enabled?: boolean | null
          saudization_percentage?: number | null
          saudization_target?: number | null
          size_category?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      companies_private_top500: {
        Row: {
          boe_registration_no: string | null
          created_at: string
          headquarters_city_id: string | null
          id: string
          name_ar: string
          name_en: string
          revenue_rank: number | null
          sector_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          boe_registration_no?: string | null
          created_at?: string
          headquarters_city_id?: string | null
          id?: string
          name_ar: string
          name_en: string
          revenue_rank?: number | null
          sector_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          boe_registration_no?: string | null
          created_at?: string
          headquarters_city_id?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          revenue_rank?: number | null
          sector_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_private_top500_headquarters_city_id_fkey"
            columns: ["headquarters_city_id"]
            isOneToOne: false
            referencedRelation: "saudi_cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_private_top500_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "saudi_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      company_compliance_settings: {
        Row: {
          allow_cross_border_transfer: boolean | null
          allow_external_ai: boolean | null
          audit_requirements: string | null
          company_id: string
          company_type: string
          compliance_level: string
          compliance_officer_email: string | null
          compliance_officer_name: string | null
          created_at: string
          data_classification: string | null
          id: string
          last_compliance_review: string | null
          next_compliance_review: string | null
          regulatory_framework: string[] | null
          updated_at: string
        }
        Insert: {
          allow_cross_border_transfer?: boolean | null
          allow_external_ai?: boolean | null
          audit_requirements?: string | null
          company_id: string
          company_type?: string
          compliance_level?: string
          compliance_officer_email?: string | null
          compliance_officer_name?: string | null
          created_at?: string
          data_classification?: string | null
          id?: string
          last_compliance_review?: string | null
          next_compliance_review?: string | null
          regulatory_framework?: string[] | null
          updated_at?: string
        }
        Update: {
          allow_cross_border_transfer?: boolean | null
          allow_external_ai?: boolean | null
          audit_requirements?: string | null
          company_id?: string
          company_type?: string
          compliance_level?: string
          compliance_officer_email?: string | null
          compliance_officer_name?: string | null
          created_at?: string
          data_classification?: string | null
          id?: string
          last_compliance_review?: string | null
          next_compliance_review?: string | null
          regulatory_framework?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      company_intelligence: {
        Row: {
          company_id: string
          company_name_ar: string | null
          company_name_en: string | null
          company_type: string | null
          confidence_score: number | null
          contract_potential_score: number | null
          created_at: string | null
          id: number
          nitaqat_color: string | null
          saudization_rate: number | null
          sector_primary: string | null
          total_employees: number | null
        }
        Insert: {
          company_id: string
          company_name_ar?: string | null
          company_name_en?: string | null
          company_type?: string | null
          confidence_score?: number | null
          contract_potential_score?: number | null
          created_at?: string | null
          id?: number
          nitaqat_color?: string | null
          saudization_rate?: number | null
          sector_primary?: string | null
          total_employees?: number | null
        }
        Update: {
          company_id?: string
          company_name_ar?: string | null
          company_name_en?: string | null
          company_type?: string | null
          confidence_score?: number | null
          contract_potential_score?: number | null
          created_at?: string | null
          id?: number
          nitaqat_color?: string | null
          saudization_rate?: number | null
          sector_primary?: string | null
          total_employees?: number | null
        }
        Relationships: []
      }
      cross_system_recommendations: {
        Row: {
          company_id: string | null
          created_at: string | null
          employee_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority_score: number | null
          recommendation_data: Json
          recommendation_type: string
          source_system: string
          target_system: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority_score?: number | null
          recommendation_data?: Json
          recommendation_type: string
          source_system: string
          target_system: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority_score?: number | null
          recommendation_data?: Json
          recommendation_type?: string
          source_system?: string
          target_system?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          budget_allocated: number | null
          building_name: string | null
          company_id: string
          cost_center: string | null
          created_at: string | null
          department_code: string | null
          department_name_arabic: string
          department_name_english: string
          floor_number: number | null
          id: string
          location_arabic: string | null
          location_english: string | null
          manager_id: string | null
          parent_department_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget_allocated?: number | null
          building_name?: string | null
          company_id: string
          cost_center?: string | null
          created_at?: string | null
          department_code?: string | null
          department_name_arabic: string
          department_name_english: string
          floor_number?: number | null
          id?: string
          location_arabic?: string | null
          location_english?: string | null
          manager_id?: string | null
          parent_department_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_allocated?: number | null
          building_name?: string | null
          company_id?: string
          cost_center?: string | null
          created_at?: string | null
          department_code?: string | null
          department_name_arabic?: string
          department_name_english?: string
          floor_number?: number | null
          id?: string
          location_arabic?: string | null
          location_english?: string | null
          manager_id?: string | null
          parent_department_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          allowed_file_types: string[] | null
          category: string | null
          company_id: string | null
          confidentiality_level: string | null
          created_at: string | null
          department_access: string[] | null
          document_type_code: string | null
          document_type_name_arabic: string
          document_type_name_english: string
          expiry_reminder_days: number | null
          id: string
          is_mandatory: boolean | null
          max_file_size_mb: number | null
          requires_expiry_date: boolean | null
          status: string | null
          subcategory: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_file_types?: string[] | null
          category?: string | null
          company_id?: string | null
          confidentiality_level?: string | null
          created_at?: string | null
          department_access?: string[] | null
          document_type_code?: string | null
          document_type_name_arabic: string
          document_type_name_english: string
          expiry_reminder_days?: number | null
          id?: string
          is_mandatory?: boolean | null
          max_file_size_mb?: number | null
          requires_expiry_date?: boolean | null
          status?: string | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_file_types?: string[] | null
          category?: string | null
          company_id?: string | null
          confidentiality_level?: string | null
          created_at?: string | null
          department_access?: string[] | null
          document_type_code?: string | null
          document_type_name_arabic?: string
          document_type_name_english?: string
          expiry_reminder_days?: number | null
          id?: string
          is_mandatory?: boolean | null
          max_file_size_mb?: number | null
          requires_expiry_date?: boolean | null
          status?: string | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      document_uploads: {
        Row: {
          ai_analysis_results: Json | null
          assessment_id: number | null
          assessment_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: number
          processed_date: string | null
          processing_status: string | null
          upload_date: string | null
          upload_status: string | null
        }
        Insert: {
          ai_analysis_results?: Json | null
          assessment_id?: number | null
          assessment_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: number
          processed_date?: string | null
          processing_status?: string | null
          upload_date?: string | null
          upload_status?: string | null
        }
        Update: {
          ai_analysis_results?: Json | null
          assessment_id?: number | null
          assessment_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: number
          processed_date?: string | null
          processing_status?: string | null
          upload_date?: string | null
          upload_status?: string | null
        }
        Relationships: []
      }
      employee_benefits: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          benefit_plan_id: string
          coverage_amount: number | null
          coverage_level: string | null
          created_at: string | null
          effective_date: string
          employee_contribution: number | null
          employee_id: string
          employer_contribution: number | null
          enrollment_date: string
          id: string
          primary_beneficiary_name: string | null
          primary_beneficiary_percentage: number | null
          primary_beneficiary_relationship: string | null
          secondary_beneficiary_name: string | null
          secondary_beneficiary_percentage: number | null
          secondary_beneficiary_relationship: string | null
          status: string | null
          termination_date: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          benefit_plan_id: string
          coverage_amount?: number | null
          coverage_level?: string | null
          created_at?: string | null
          effective_date: string
          employee_contribution?: number | null
          employee_id: string
          employer_contribution?: number | null
          enrollment_date: string
          id?: string
          primary_beneficiary_name?: string | null
          primary_beneficiary_percentage?: number | null
          primary_beneficiary_relationship?: string | null
          secondary_beneficiary_name?: string | null
          secondary_beneficiary_percentage?: number | null
          secondary_beneficiary_relationship?: string | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          benefit_plan_id?: string
          coverage_amount?: number | null
          coverage_level?: string | null
          created_at?: string | null
          effective_date?: string
          employee_contribution?: number | null
          employee_id?: string
          employer_contribution?: number | null
          enrollment_date?: string
          id?: string
          primary_beneficiary_name?: string | null
          primary_beneficiary_percentage?: number | null
          primary_beneficiary_relationship?: string | null
          secondary_beneficiary_name?: string | null
          secondary_beneficiary_percentage?: number | null
          secondary_beneficiary_relationship?: string | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_benefit_plan_id_fkey"
            columns: ["benefit_plan_id"]
            isOneToOne: false
            referencedRelation: "benefit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          company_id: string | null
          created_at: string | null
          description_arabic: string | null
          description_english: string | null
          document_date: string | null
          document_name_arabic: string | null
          document_name_english: string
          document_number: string | null
          document_type_id: string
          employee_id: string
          expiry_date: string | null
          file_name: string
          file_size_kb: number | null
          file_type: string | null
          file_url: string
          id: string
          last_verification_date: string | null
          next_verification_date: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          upload_date: string
          uploaded_by: string | null
          verification_date: string | null
          verification_notes: string | null
          verification_status: string | null
          verified_by: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description_arabic?: string | null
          description_english?: string | null
          document_date?: string | null
          document_name_arabic?: string | null
          document_name_english: string
          document_number?: string | null
          document_type_id: string
          employee_id: string
          expiry_date?: string | null
          file_name: string
          file_size_kb?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          last_verification_date?: string | null
          next_verification_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          upload_date: string
          uploaded_by?: string | null
          verification_date?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_by?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description_arabic?: string | null
          description_english?: string | null
          document_date?: string | null
          document_name_arabic?: string | null
          document_name_english?: string
          document_number?: string | null
          document_type_id?: string
          employee_id?: string
          expiry_date?: string | null
          file_name?: string
          file_size_kb?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          last_verification_date?: string | null
          next_verification_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          upload_date?: string
          uploaded_by?: string | null
          verification_date?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_gosi_config: {
        Row: {
          created_at: string | null
          current_employee_rate: number
          current_employer_rate: number
          effective_from: string
          employee_id: string | null
          gosi_system_type: string
          hire_date: string
          id: string
          nationality: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_employee_rate: number
          current_employer_rate: number
          effective_from: string
          employee_id?: string | null
          gosi_system_type: string
          hire_date: string
          id?: string
          nationality: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_employee_rate?: number
          current_employer_rate?: number
          effective_from?: string
          employee_id?: string | null
          gosi_system_type?: string
          hire_date?: string
          id?: string
          nationality?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_gosi_config_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_kpi_assignments: {
        Row: {
          achievement_percentage: number
          created_at: string
          current_value: number
          employee_id: string
          id: string
          is_active: boolean
          job_title_kpi_id: string
          review_period: string
          status: string
          target_value: number
          updated_at: string
        }
        Insert: {
          achievement_percentage?: number
          created_at?: string
          current_value?: number
          employee_id: string
          id?: string
          is_active?: boolean
          job_title_kpi_id: string
          review_period: string
          status?: string
          target_value: number
          updated_at?: string
        }
        Update: {
          achievement_percentage?: number
          created_at?: string
          current_value?: number
          employee_id?: string
          id?: string
          is_active?: boolean
          job_title_kpi_id?: string
          review_period?: string
          status?: string
          target_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      employee_positions: {
        Row: {
          assignment_percentage: number | null
          base_salary: number | null
          created_at: string | null
          currency: string | null
          department_id: string
          direct_manager_id: string | null
          employee_id: string
          end_date: string | null
          id: string
          is_primary: boolean | null
          position_id: string
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_percentage?: number | null
          base_salary?: number | null
          created_at?: string | null
          currency?: string | null
          department_id: string
          direct_manager_id?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          is_primary?: boolean | null
          position_id: string
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_percentage?: number | null
          base_salary?: number | null
          created_at?: string | null
          currency?: string | null
          department_id?: string
          direct_manager_id?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          is_primary?: boolean | null
          position_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_positions_direct_manager_id_fkey"
            columns: ["direct_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_positions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_reports: {
        Row: {
          company_id: string | null
          created_at: string | null
          filters: Json | null
          generated_at: string | null
          generated_by: string
          id: string
          report_data: Json
          report_description: string | null
          report_name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          filters?: Json | null
          generated_at?: string | null
          generated_by: string
          id?: string
          report_data: Json
          report_description?: string | null
          report_name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          filters?: Json | null
          generated_at?: string | null
          generated_by?: string
          id?: string
          report_data?: Json
          report_description?: string | null
          report_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_schedules: {
        Row: {
          created_at: string | null
          custom_end_time: string | null
          custom_start_time: string | null
          effective_from_date: string
          effective_to_date: string | null
          employee_id: string
          id: string
          status: string | null
          updated_at: string | null
          work_schedule_id: string
        }
        Insert: {
          created_at?: string | null
          custom_end_time?: string | null
          custom_start_time?: string | null
          effective_from_date: string
          effective_to_date?: string | null
          employee_id: string
          id?: string
          status?: string | null
          updated_at?: string | null
          work_schedule_id: string
        }
        Update: {
          created_at?: string | null
          custom_end_time?: string | null
          custom_start_time?: string | null
          effective_from_date?: string
          effective_to_date?: string | null
          employee_id?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          work_schedule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedules_work_schedule_id_fkey"
            columns: ["work_schedule_id"]
            isOneToOne: false
            referencedRelation: "work_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          actual_job_title: string | null
          actual_job_title_ar: string | null
          additional_attributes: Json | null
          address_arabic: string | null
          address_english: string | null
          agreed_annual_bonus: number | null
          annual_tickets_count: number | null
          annual_tickets_type: string | null
          basic_salary: number | null
          certificates: string | null
          certificates_ar: string | null
          city_arabic: string | null
          city_english: string | null
          company_email: string | null
          company_housing: boolean | null
          company_id: string | null
          company_job_title: string | null
          company_job_title_ar: string | null
          company_phone: string | null
          company_provides_transportation: boolean | null
          company_sim_card: boolean | null
          contract_type: string | null
          created_at: string | null
          department: string | null
          driver_license_number: string | null
          education_level: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_number: string | null
          employee_number: string
          experience_years: number | null
          family_name_ar: string | null
          family_status: string | null
          first_name: string
          first_name_ar: string | null
          gender: string | null
          gosi_cost_per_month: number | null
          gosi_number: string | null
          grade_level: string | null
          hijri_birth_date: string | null
          hijri_hire_date: string | null
          hire_date: string | null
          hired_request_number: string | null
          housing_allowance_percentage: number | null
          iban_number: string | null
          id: string
          iqama_expiry_date: string | null
          iqama_number: string | null
          iqama_title: string | null
          iqama_title_ar: string | null
          is_saudi: boolean | null
          job_description: string | null
          job_description_ar: string | null
          job_level: string | null
          job_location: string | null
          joining_date: string | null
          kpis: string | null
          kpis_ar: string | null
          last_name: string
          last_name_ar: string | null
          life_insurance_home_country: boolean | null
          line_manager_extension: string | null
          medical_conditions: string | null
          medical_conditions_ar: string | null
          middle_name: string | null
          middle_name_ar: string | null
          mol_number: string | null
          national_address: string | null
          national_id: string | null
          nationality: string | null
          nitaqat_classification: string | null
          number_of_children: number | null
          number_of_wives: number | null
          other_benefits: string | null
          other_benefits_ar: string | null
          overtime_eligible: boolean | null
          parents_medical_insurance: boolean | null
          passport_expiry_date: string | null
          passport_number: string | null
          personal_email: string | null
          phone: string | null
          position: string | null
          position_ar: string | null
          position_hired_for: string | null
          position_hired_for_ar: string | null
          postal_code: string | null
          project_cost_number: string | null
          project_hired_for: string | null
          project_hired_for_ar: string | null
          project_name: string | null
          project_name_ar: string | null
          project_number: string | null
          qiwa_contract: boolean | null
          qiwa_permit_number: string | null
          recruitment_type: string | null
          religion: string | null
          salary: number | null
          salary_level: string | null
          saudi_engineer_card_number: string | null
          schooling_fees_coverage: string | null
          shift_type: string | null
          status: string | null
          transportation_allowance_percentage: number | null
          updated_at: string | null
          vacation_days_per_year: number | null
          visa_expiry_date: string | null
          visa_number: string | null
          work_location: string | null
          work_location_ar: string | null
        }
        Insert: {
          actual_job_title?: string | null
          actual_job_title_ar?: string | null
          additional_attributes?: Json | null
          address_arabic?: string | null
          address_english?: string | null
          agreed_annual_bonus?: number | null
          annual_tickets_count?: number | null
          annual_tickets_type?: string | null
          basic_salary?: number | null
          certificates?: string | null
          certificates_ar?: string | null
          city_arabic?: string | null
          city_english?: string | null
          company_email?: string | null
          company_housing?: boolean | null
          company_id?: string | null
          company_job_title?: string | null
          company_job_title_ar?: string | null
          company_phone?: string | null
          company_provides_transportation?: boolean | null
          company_sim_card?: boolean | null
          contract_type?: string | null
          created_at?: string | null
          department?: string | null
          driver_license_number?: string | null
          education_level?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          employee_number: string
          experience_years?: number | null
          family_name_ar?: string | null
          family_status?: string | null
          first_name: string
          first_name_ar?: string | null
          gender?: string | null
          gosi_cost_per_month?: number | null
          gosi_number?: string | null
          grade_level?: string | null
          hijri_birth_date?: string | null
          hijri_hire_date?: string | null
          hire_date?: string | null
          hired_request_number?: string | null
          housing_allowance_percentage?: number | null
          iban_number?: string | null
          id?: string
          iqama_expiry_date?: string | null
          iqama_number?: string | null
          iqama_title?: string | null
          iqama_title_ar?: string | null
          is_saudi?: boolean | null
          job_description?: string | null
          job_description_ar?: string | null
          job_level?: string | null
          job_location?: string | null
          joining_date?: string | null
          kpis?: string | null
          kpis_ar?: string | null
          last_name: string
          last_name_ar?: string | null
          life_insurance_home_country?: boolean | null
          line_manager_extension?: string | null
          medical_conditions?: string | null
          medical_conditions_ar?: string | null
          middle_name?: string | null
          middle_name_ar?: string | null
          mol_number?: string | null
          national_address?: string | null
          national_id?: string | null
          nationality?: string | null
          nitaqat_classification?: string | null
          number_of_children?: number | null
          number_of_wives?: number | null
          other_benefits?: string | null
          other_benefits_ar?: string | null
          overtime_eligible?: boolean | null
          parents_medical_insurance?: boolean | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          personal_email?: string | null
          phone?: string | null
          position?: string | null
          position_ar?: string | null
          position_hired_for?: string | null
          position_hired_for_ar?: string | null
          postal_code?: string | null
          project_cost_number?: string | null
          project_hired_for?: string | null
          project_hired_for_ar?: string | null
          project_name?: string | null
          project_name_ar?: string | null
          project_number?: string | null
          qiwa_contract?: boolean | null
          qiwa_permit_number?: string | null
          recruitment_type?: string | null
          religion?: string | null
          salary?: number | null
          salary_level?: string | null
          saudi_engineer_card_number?: string | null
          schooling_fees_coverage?: string | null
          shift_type?: string | null
          status?: string | null
          transportation_allowance_percentage?: number | null
          updated_at?: string | null
          vacation_days_per_year?: number | null
          visa_expiry_date?: string | null
          visa_number?: string | null
          work_location?: string | null
          work_location_ar?: string | null
        }
        Update: {
          actual_job_title?: string | null
          actual_job_title_ar?: string | null
          additional_attributes?: Json | null
          address_arabic?: string | null
          address_english?: string | null
          agreed_annual_bonus?: number | null
          annual_tickets_count?: number | null
          annual_tickets_type?: string | null
          basic_salary?: number | null
          certificates?: string | null
          certificates_ar?: string | null
          city_arabic?: string | null
          city_english?: string | null
          company_email?: string | null
          company_housing?: boolean | null
          company_id?: string | null
          company_job_title?: string | null
          company_job_title_ar?: string | null
          company_phone?: string | null
          company_provides_transportation?: boolean | null
          company_sim_card?: boolean | null
          contract_type?: string | null
          created_at?: string | null
          department?: string | null
          driver_license_number?: string | null
          education_level?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          employee_number?: string
          experience_years?: number | null
          family_name_ar?: string | null
          family_status?: string | null
          first_name?: string
          first_name_ar?: string | null
          gender?: string | null
          gosi_cost_per_month?: number | null
          gosi_number?: string | null
          grade_level?: string | null
          hijri_birth_date?: string | null
          hijri_hire_date?: string | null
          hire_date?: string | null
          hired_request_number?: string | null
          housing_allowance_percentage?: number | null
          iban_number?: string | null
          id?: string
          iqama_expiry_date?: string | null
          iqama_number?: string | null
          iqama_title?: string | null
          iqama_title_ar?: string | null
          is_saudi?: boolean | null
          job_description?: string | null
          job_description_ar?: string | null
          job_level?: string | null
          job_location?: string | null
          joining_date?: string | null
          kpis?: string | null
          kpis_ar?: string | null
          last_name?: string
          last_name_ar?: string | null
          life_insurance_home_country?: boolean | null
          line_manager_extension?: string | null
          medical_conditions?: string | null
          medical_conditions_ar?: string | null
          middle_name?: string | null
          middle_name_ar?: string | null
          mol_number?: string | null
          national_address?: string | null
          national_id?: string | null
          nationality?: string | null
          nitaqat_classification?: string | null
          number_of_children?: number | null
          number_of_wives?: number | null
          other_benefits?: string | null
          other_benefits_ar?: string | null
          overtime_eligible?: boolean | null
          parents_medical_insurance?: boolean | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          personal_email?: string | null
          phone?: string | null
          position?: string | null
          position_ar?: string | null
          position_hired_for?: string | null
          position_hired_for_ar?: string | null
          postal_code?: string | null
          project_cost_number?: string | null
          project_hired_for?: string | null
          project_hired_for_ar?: string | null
          project_name?: string | null
          project_name_ar?: string | null
          project_number?: string | null
          qiwa_contract?: boolean | null
          qiwa_permit_number?: string | null
          recruitment_type?: string | null
          religion?: string | null
          salary?: number | null
          salary_level?: string | null
          saudi_engineer_card_number?: string | null
          schooling_fees_coverage?: string | null
          shift_type?: string | null
          status?: string | null
          transportation_allowance_percentage?: number | null
          updated_at?: string | null
          vacation_days_per_year?: number | null
          visa_expiry_date?: string | null
          visa_number?: string | null
          work_location?: string | null
          work_location_ar?: string | null
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
      engagement_metrics_tracking: {
        Row: {
          collaboration_score: number | null
          company_id: string | null
          connections_made: number | null
          created_at: string | null
          employee_id: string | null
          engagement_score: number | null
          id: string
          learning_correlation: number | null
          measurement_date: string | null
          pulse_response_rate: number | null
          recognition_given: number | null
          recognition_received: number | null
          updated_at: string | null
        }
        Insert: {
          collaboration_score?: number | null
          company_id?: string | null
          connections_made?: number | null
          created_at?: string | null
          employee_id?: string | null
          engagement_score?: number | null
          id?: string
          learning_correlation?: number | null
          measurement_date?: string | null
          pulse_response_rate?: number | null
          recognition_given?: number | null
          recognition_received?: number | null
          updated_at?: string | null
        }
        Update: {
          collaboration_score?: number | null
          company_id?: string | null
          connections_made?: number | null
          created_at?: string | null
          employee_id?: string | null
          engagement_score?: number | null
          id?: string
          learning_correlation?: number | null
          measurement_date?: string | null
          pulse_response_rate?: number | null
          recognition_given?: number | null
          recognition_received?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      esg_assessments: {
        Row: {
          assessment_data: Json | null
          assessment_date: string | null
          compliance_frameworks: Json | null
          created_at: string | null
          environmental_score: number | null
          governance_score: number | null
          id: number
          maturity_level: string | null
          organization_name: string
          overall_score: number | null
          social_score: number | null
          updated_at: string | null
        }
        Insert: {
          assessment_data?: Json | null
          assessment_date?: string | null
          compliance_frameworks?: Json | null
          created_at?: string | null
          environmental_score?: number | null
          governance_score?: number | null
          id?: number
          maturity_level?: string | null
          organization_name: string
          overall_score?: number | null
          social_score?: number | null
          updated_at?: string | null
        }
        Update: {
          assessment_data?: Json | null
          assessment_date?: string | null
          compliance_frameworks?: Json | null
          created_at?: string | null
          environmental_score?: number | null
          governance_score?: number | null
          id?: number
          maturity_level?: string | null
          organization_name?: string
          overall_score?: number | null
          social_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      esg_benchmarks: {
        Row: {
          benchmark_year: number | null
          company_size: string
          created_at: string | null
          environmental_avg: number | null
          governance_avg: number | null
          id: number
          industry_sector: string
          overall_avg: number | null
          region: string
          sample_size: number | null
          social_avg: number | null
        }
        Insert: {
          benchmark_year?: number | null
          company_size: string
          created_at?: string | null
          environmental_avg?: number | null
          governance_avg?: number | null
          id?: number
          industry_sector: string
          overall_avg?: number | null
          region: string
          sample_size?: number | null
          social_avg?: number | null
        }
        Update: {
          benchmark_year?: number | null
          company_size?: string
          created_at?: string | null
          environmental_avg?: number | null
          governance_avg?: number | null
          id?: number
          industry_sector?: string
          overall_avg?: number | null
          region?: string
          sample_size?: number | null
          social_avg?: number | null
        }
        Relationships: []
      }
      esg_metrics: {
        Row: {
          assessment_id: number | null
          category: string
          created_at: string | null
          data_source: string | null
          id: number
          metric_name: string
          metric_value: number | null
          reporting_period: string | null
          target_value: number | null
          unit: string | null
          verification_status: string | null
        }
        Insert: {
          assessment_id?: number | null
          category: string
          created_at?: string | null
          data_source?: string | null
          id?: number
          metric_name: string
          metric_value?: number | null
          reporting_period?: string | null
          target_value?: number | null
          unit?: string | null
          verification_status?: string | null
        }
        Update: {
          assessment_id?: number | null
          category?: string
          created_at?: string | null
          data_source?: string | null
          id?: number
          metric_name?: string
          metric_value?: number | null
          reporting_period?: string | null
          target_value?: number | null
          unit?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_metrics_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "esg_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      executive_metrics: {
        Row: {
          average_salary: number | null
          cost_per_employee: number | null
          created_at: string | null
          gosi_penalties: number | null
          government_compliance_score: number | null
          id: string
          local_content_percentage: number | null
          metric_date: string
          metric_period: string
          mol_penalties: number | null
          new_hires: number | null
          nitaqat_incentives: number | null
          nitaqat_status: string | null
          saudization_ratio: number | null
          terminations: number | null
          total_employees: number | null
          total_payroll_cost: number | null
          turnover_rate: number | null
          vision_2030_score: number | null
        }
        Insert: {
          average_salary?: number | null
          cost_per_employee?: number | null
          created_at?: string | null
          gosi_penalties?: number | null
          government_compliance_score?: number | null
          id?: string
          local_content_percentage?: number | null
          metric_date: string
          metric_period: string
          mol_penalties?: number | null
          new_hires?: number | null
          nitaqat_incentives?: number | null
          nitaqat_status?: string | null
          saudization_ratio?: number | null
          terminations?: number | null
          total_employees?: number | null
          total_payroll_cost?: number | null
          turnover_rate?: number | null
          vision_2030_score?: number | null
        }
        Update: {
          average_salary?: number | null
          cost_per_employee?: number | null
          created_at?: string | null
          gosi_penalties?: number | null
          government_compliance_score?: number | null
          id?: string
          local_content_percentage?: number | null
          metric_date?: string
          metric_period?: string
          mol_penalties?: number | null
          new_hires?: number | null
          nitaqat_incentives?: number | null
          nitaqat_status?: string | null
          saudization_ratio?: number | null
          terminations?: number | null
          total_employees?: number | null
          total_payroll_cost?: number | null
          turnover_rate?: number | null
          vision_2030_score?: number | null
        }
        Relationships: []
      }
      gosi_rate_history: {
        Row: {
          created_at: string | null
          effective_from: string
          effective_to: string | null
          employee_rate: number
          employer_rate: number
          id: string
          nationality: string
          system_type: string
        }
        Insert: {
          created_at?: string | null
          effective_from: string
          effective_to?: string | null
          employee_rate: number
          employer_rate: number
          id?: string
          nationality: string
          system_type: string
        }
        Update: {
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_rate?: number
          employer_rate?: number
          id?: string
          nationality?: string
          system_type?: string
        }
        Relationships: []
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
      government_compliance: {
        Row: {
          compliance_level: string | null
          compliance_score: number | null
          created_at: string | null
          employee_id: string
          gosi_contribution_amount: number | null
          gosi_last_contribution_date: string | null
          gosi_registration_date: string | null
          gosi_status: string | null
          id: string
          last_audit_date: string | null
          mol_last_check_date: string | null
          mol_next_check_date: string | null
          mol_status: string | null
          mol_violation_count: number | null
          next_audit_date: string | null
          qiwa_last_sync_date: string | null
          qiwa_permit_expiry_date: string | null
          qiwa_permit_status: string | null
          updated_at: string | null
        }
        Insert: {
          compliance_level?: string | null
          compliance_score?: number | null
          created_at?: string | null
          employee_id: string
          gosi_contribution_amount?: number | null
          gosi_last_contribution_date?: string | null
          gosi_registration_date?: string | null
          gosi_status?: string | null
          id?: string
          last_audit_date?: string | null
          mol_last_check_date?: string | null
          mol_next_check_date?: string | null
          mol_status?: string | null
          mol_violation_count?: number | null
          next_audit_date?: string | null
          qiwa_last_sync_date?: string | null
          qiwa_permit_expiry_date?: string | null
          qiwa_permit_status?: string | null
          updated_at?: string | null
        }
        Update: {
          compliance_level?: string | null
          compliance_score?: number | null
          created_at?: string | null
          employee_id?: string
          gosi_contribution_amount?: number | null
          gosi_last_contribution_date?: string | null
          gosi_registration_date?: string | null
          gosi_status?: string | null
          id?: string
          last_audit_date?: string | null
          mol_last_check_date?: string | null
          mol_next_check_date?: string | null
          mol_status?: string | null
          mol_violation_count?: number | null
          next_audit_date?: string | null
          qiwa_last_sync_date?: string | null
          qiwa_permit_expiry_date?: string | null
          qiwa_permit_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "government_compliance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      government_integration_log: {
        Row: {
          action_type: string
          completed_at: string | null
          created_at: string | null
          employee_id: string | null
          endpoint: string | null
          error_code: string | null
          error_message: string | null
          id: string
          integration_type: string
          next_retry_at: string | null
          request_data: Json | null
          response_data: Json | null
          retry_count: number | null
          status: string
        }
        Insert: {
          action_type: string
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          endpoint?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          integration_type: string
          next_retry_at?: string | null
          request_data?: Json | null
          response_data?: Json | null
          retry_count?: number | null
          status?: string
        }
        Update: {
          action_type?: string
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          endpoint?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          integration_type?: string
          next_retry_at?: string | null
          request_data?: Json | null
          response_data?: Json | null
          retry_count?: number | null
          status?: string
        }
        Relationships: []
      }
      hse_compliance: {
        Row: {
          company_id: string | null
          compliance_status: string
          created_at: string
          deadline: string | null
          evidence_documents: Json | null
          id: string
          last_assessment_date: string | null
          next_assessment_date: string | null
          notes: string | null
          regulation_name: string
          regulation_name_ar: string | null
          regulation_type: string
          requirement_description: string
          responsible_person_id: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          compliance_status?: string
          created_at?: string
          deadline?: string | null
          evidence_documents?: Json | null
          id?: string
          last_assessment_date?: string | null
          next_assessment_date?: string | null
          notes?: string | null
          regulation_name: string
          regulation_name_ar?: string | null
          regulation_type: string
          requirement_description: string
          responsible_person_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          compliance_status?: string
          created_at?: string
          deadline?: string | null
          evidence_documents?: Json | null
          id?: string
          last_assessment_date?: string | null
          next_assessment_date?: string | null
          notes?: string | null
          regulation_name?: string
          regulation_name_ar?: string | null
          regulation_type?: string
          requirement_description?: string
          responsible_person_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_compliance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_compliance_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_emergency_team_members: {
        Row: {
          availability_status: string
          certification_expiry: string | null
          certification_status: string
          created_at: string
          employee_id: string | null
          id: string
          role: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          availability_status?: string
          certification_expiry?: string | null
          certification_status?: string
          created_at?: string
          employee_id?: string | null
          id?: string
          role: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          availability_status?: string
          certification_expiry?: string | null
          certification_status?: string
          created_at?: string
          employee_id?: string | null
          id?: string
          role?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_emergency_team_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_emergency_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "hse_emergency_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_emergency_teams: {
        Row: {
          activation_criteria: string | null
          company_id: string | null
          contact_number: string | null
          created_at: string
          equipment_checklist: Json | null
          id: string
          is_active: boolean | null
          location: string
          response_procedures: string | null
          team_leader_id: string | null
          team_name: string
          team_name_ar: string | null
          team_type: string
          training_requirements: Json | null
          updated_at: string
        }
        Insert: {
          activation_criteria?: string | null
          company_id?: string | null
          contact_number?: string | null
          created_at?: string
          equipment_checklist?: Json | null
          id?: string
          is_active?: boolean | null
          location: string
          response_procedures?: string | null
          team_leader_id?: string | null
          team_name: string
          team_name_ar?: string | null
          team_type: string
          training_requirements?: Json | null
          updated_at?: string
        }
        Update: {
          activation_criteria?: string | null
          company_id?: string | null
          contact_number?: string | null
          created_at?: string
          equipment_checklist?: Json | null
          id?: string
          is_active?: boolean | null
          location?: string
          response_procedures?: string | null
          team_leader_id?: string | null
          team_name?: string
          team_name_ar?: string | null
          team_type?: string
          training_requirements?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_emergency_teams_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_emergency_teams_team_leader_id_fkey"
            columns: ["team_leader_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_incidents: {
        Row: {
          company_id: string | null
          corrective_actions: string | null
          created_at: string
          description: string
          employee_id: string | null
          estimated_cost: number | null
          id: string
          immediate_cause: string | null
          incident_date: string
          incident_number: string
          incident_type: string
          investigation_status: string
          investigator_id: string | null
          location: string
          lost_time_incident: boolean | null
          medical_treatment_required: boolean | null
          photos: Json | null
          regulatory_reportable: boolean | null
          reported_date: string
          root_cause: string | null
          severity_level: number
          updated_at: string
          witness_statements: Json | null
        }
        Insert: {
          company_id?: string | null
          corrective_actions?: string | null
          created_at?: string
          description: string
          employee_id?: string | null
          estimated_cost?: number | null
          id?: string
          immediate_cause?: string | null
          incident_date: string
          incident_number: string
          incident_type: string
          investigation_status?: string
          investigator_id?: string | null
          location: string
          lost_time_incident?: boolean | null
          medical_treatment_required?: boolean | null
          photos?: Json | null
          regulatory_reportable?: boolean | null
          reported_date?: string
          root_cause?: string | null
          severity_level: number
          updated_at?: string
          witness_statements?: Json | null
        }
        Update: {
          company_id?: string | null
          corrective_actions?: string | null
          created_at?: string
          description?: string
          employee_id?: string | null
          estimated_cost?: number | null
          id?: string
          immediate_cause?: string | null
          incident_date?: string
          incident_number?: string
          incident_type?: string
          investigation_status?: string
          investigator_id?: string | null
          location?: string
          lost_time_incident?: boolean | null
          medical_treatment_required?: boolean | null
          photos?: Json | null
          regulatory_reportable?: boolean | null
          reported_date?: string
          root_cause?: string | null
          severity_level?: number
          updated_at?: string
          witness_statements?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "hse_incidents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_incidents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_incidents_investigator_id_fkey"
            columns: ["investigator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_kpis: {
        Row: {
          actual_value: number | null
          calculation_method: string | null
          company_id: string | null
          created_at: string
          id: string
          kpi_category: string
          kpi_name: string
          kpi_name_ar: string | null
          last_measured_date: string | null
          measurement_frequency: string
          next_measurement_date: string | null
          responsible_person_id: string | null
          target_value: number
          trend_direction: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          actual_value?: number | null
          calculation_method?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          kpi_category: string
          kpi_name: string
          kpi_name_ar?: string | null
          last_measured_date?: string | null
          measurement_frequency: string
          next_measurement_date?: string | null
          responsible_person_id?: string | null
          target_value: number
          trend_direction?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          actual_value?: number | null
          calculation_method?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          kpi_category?: string
          kpi_name?: string
          kpi_name_ar?: string | null
          last_measured_date?: string | null
          measurement_frequency?: string
          next_measurement_date?: string | null
          responsible_person_id?: string | null
          target_value?: number
          trend_direction?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_kpis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_kpis_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_medical_surveillance: {
        Row: {
          company_id: string | null
          created_at: string
          employee_id: string | null
          examination_date: string
          examination_type: string
          exposure_monitoring: Json | null
          fitness_status: string
          follow_up_required: boolean | null
          health_surveillance_category: string | null
          id: string
          medical_certificate_number: string | null
          medical_provider: string | null
          next_examination_date: string | null
          recommendations: string | null
          restrictions: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          employee_id?: string | null
          examination_date: string
          examination_type: string
          exposure_monitoring?: Json | null
          fitness_status: string
          follow_up_required?: boolean | null
          health_surveillance_category?: string | null
          id?: string
          medical_certificate_number?: string | null
          medical_provider?: string | null
          next_examination_date?: string | null
          recommendations?: string | null
          restrictions?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          employee_id?: string | null
          examination_date?: string
          examination_type?: string
          exposure_monitoring?: Json | null
          fitness_status?: string
          follow_up_required?: boolean | null
          health_surveillance_category?: string | null
          id?: string
          medical_certificate_number?: string | null
          medical_provider?: string | null
          next_examination_date?: string | null
          recommendations?: string | null
          restrictions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_medical_surveillance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_medical_surveillance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_ppe: {
        Row: {
          company_id: string | null
          condition_status: string
          cost: number | null
          created_at: string
          employee_id: string | null
          equipment_brand: string | null
          equipment_model: string | null
          equipment_type: string
          expiry_date: string | null
          id: string
          inspection_frequency: number | null
          issue_date: string
          last_inspection_date: string | null
          next_inspection_date: string | null
          replacement_due_date: string | null
          serial_number: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          condition_status?: string
          cost?: number | null
          created_at?: string
          employee_id?: string | null
          equipment_brand?: string | null
          equipment_model?: string | null
          equipment_type: string
          expiry_date?: string | null
          id?: string
          inspection_frequency?: number | null
          issue_date: string
          last_inspection_date?: string | null
          next_inspection_date?: string | null
          replacement_due_date?: string | null
          serial_number?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          condition_status?: string
          cost?: number | null
          created_at?: string
          employee_id?: string | null
          equipment_brand?: string | null
          equipment_model?: string | null
          equipment_type?: string
          expiry_date?: string | null
          id?: string
          inspection_frequency?: number | null
          issue_date?: string
          last_inspection_date?: string | null
          next_inspection_date?: string | null
          replacement_due_date?: string | null
          serial_number?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_ppe_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_ppe_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_risk_assessments: {
        Row: {
          additional_controls: string | null
          assessment_number: string
          assessor_id: string | null
          company_id: string | null
          created_at: string
          department: string
          existing_controls: string | null
          hazard_identification: string
          id: string
          likelihood: number
          next_review_date: string
          residual_likelihood: number | null
          residual_risk_score: number | null
          residual_severity: number | null
          review_date: string
          risk_description: string
          risk_level: string | null
          risk_score: number | null
          severity: number
          status: string
          updated_at: string
          work_activity: string
        }
        Insert: {
          additional_controls?: string | null
          assessment_number: string
          assessor_id?: string | null
          company_id?: string | null
          created_at?: string
          department: string
          existing_controls?: string | null
          hazard_identification: string
          id?: string
          likelihood: number
          next_review_date: string
          residual_likelihood?: number | null
          residual_risk_score?: number | null
          residual_severity?: number | null
          review_date: string
          risk_description: string
          risk_level?: string | null
          risk_score?: number | null
          severity: number
          status?: string
          updated_at?: string
          work_activity: string
        }
        Update: {
          additional_controls?: string | null
          assessment_number?: string
          assessor_id?: string | null
          company_id?: string | null
          created_at?: string
          department?: string
          existing_controls?: string | null
          hazard_identification?: string
          id?: string
          likelihood?: number
          next_review_date?: string
          residual_likelihood?: number | null
          residual_risk_score?: number | null
          residual_severity?: number | null
          review_date?: string
          risk_description?: string
          risk_level?: string | null
          risk_score?: number | null
          severity?: number
          status?: string
          updated_at?: string
          work_activity?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_risk_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_risk_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hse_training: {
        Row: {
          actual_score: number | null
          certification_body: string | null
          certification_number: string | null
          company_id: string | null
          completion_date: string
          course_name: string
          course_name_ar: string | null
          course_type: string
          created_at: string
          employee_id: string | null
          expiry_date: string | null
          id: string
          pass_score: number | null
          renewal_alert_sent: boolean | null
          status: string
          training_hours: number | null
          training_provider: string | null
          updated_at: string
        }
        Insert: {
          actual_score?: number | null
          certification_body?: string | null
          certification_number?: string | null
          company_id?: string | null
          completion_date: string
          course_name: string
          course_name_ar?: string | null
          course_type: string
          created_at?: string
          employee_id?: string | null
          expiry_date?: string | null
          id?: string
          pass_score?: number | null
          renewal_alert_sent?: boolean | null
          status?: string
          training_hours?: number | null
          training_provider?: string | null
          updated_at?: string
        }
        Update: {
          actual_score?: number | null
          certification_body?: string | null
          certification_number?: string | null
          company_id?: string | null
          completion_date?: string
          course_name?: string
          course_name_ar?: string | null
          course_type?: string
          created_at?: string
          employee_id?: string | null
          expiry_date?: string | null
          id?: string
          pass_score?: number | null
          renewal_alert_sent?: boolean | null
          status?: string
          training_hours?: number | null
          training_provider?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hse_training_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          company_id: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_data: Json | null
          invoice_number: string
          issued_date: string | null
          paid_date: string | null
          payment_id: string | null
          status: string | null
          subtotal: number
          total_amount: number
          updated_at: string | null
          user_id: string | null
          vat_amount: number
          vat_rate: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_data?: Json | null
          invoice_number: string
          issued_date?: string | null
          paid_date?: string | null
          payment_id?: string | null
          status?: string | null
          subtotal: number
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
          vat_amount: number
          vat_rate?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_data?: Json | null
          invoice_number?: string
          issued_date?: string | null
          paid_date?: string | null
          payment_id?: string | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      ipo_assessments: {
        Row: {
          assessment_data: Json | null
          assessment_date: string | null
          company_name: string
          created_at: string | null
          estimated_cost_usd: number | null
          estimated_timeline_months: number | null
          financial_readiness_score: number | null
          governance_readiness_score: number | null
          id: number
          legal_readiness_score: number | null
          operational_readiness_score: number | null
          overall_readiness_score: number | null
          readiness_level: string | null
          recommendations: Json | null
          updated_at: string | null
        }
        Insert: {
          assessment_data?: Json | null
          assessment_date?: string | null
          company_name: string
          created_at?: string | null
          estimated_cost_usd?: number | null
          estimated_timeline_months?: number | null
          financial_readiness_score?: number | null
          governance_readiness_score?: number | null
          id?: number
          legal_readiness_score?: number | null
          operational_readiness_score?: number | null
          overall_readiness_score?: number | null
          readiness_level?: string | null
          recommendations?: Json | null
          updated_at?: string | null
        }
        Update: {
          assessment_data?: Json | null
          assessment_date?: string | null
          company_name?: string
          created_at?: string | null
          estimated_cost_usd?: number | null
          estimated_timeline_months?: number | null
          financial_readiness_score?: number | null
          governance_readiness_score?: number | null
          id?: number
          legal_readiness_score?: number | null
          operational_readiness_score?: number | null
          overall_readiness_score?: number | null
          readiness_level?: string | null
          recommendations?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          age: number | null
          applicant_name_arabic: string | null
          applicant_name_english: string
          application_date: string
          available_start_date: string | null
          company_id: string | null
          cover_letter_arabic: string | null
          cover_letter_english: string | null
          created_at: string | null
          current_employer: string | null
          current_job_title: string | null
          current_salary: number | null
          cv_file_url: string | null
          date_of_birth: string | null
          email: string
          expected_salary: number | null
          gender: string | null
          graduation_year: number | null
          highest_education: string | null
          id: string
          iqama_number: string | null
          job_posting_id: string
          major_field: string | null
          marital_status: string | null
          nationality: string | null
          notice_period_days: number | null
          passport_number: string | null
          phone: string | null
          portfolio_url: string | null
          rejection_reason: string | null
          relevant_experience_years: number | null
          saudi_id: string | null
          screened_by: string | null
          screening_date: string | null
          screening_notes: string | null
          screening_score: number | null
          status: string | null
          total_experience_years: number | null
          university_name: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          applicant_name_arabic?: string | null
          applicant_name_english: string
          application_date: string
          available_start_date?: string | null
          company_id?: string | null
          cover_letter_arabic?: string | null
          cover_letter_english?: string | null
          created_at?: string | null
          current_employer?: string | null
          current_job_title?: string | null
          current_salary?: number | null
          cv_file_url?: string | null
          date_of_birth?: string | null
          email: string
          expected_salary?: number | null
          gender?: string | null
          graduation_year?: number | null
          highest_education?: string | null
          id?: string
          iqama_number?: string | null
          job_posting_id: string
          major_field?: string | null
          marital_status?: string | null
          nationality?: string | null
          notice_period_days?: number | null
          passport_number?: string | null
          phone?: string | null
          portfolio_url?: string | null
          rejection_reason?: string | null
          relevant_experience_years?: number | null
          saudi_id?: string | null
          screened_by?: string | null
          screening_date?: string | null
          screening_notes?: string | null
          screening_score?: number | null
          status?: string | null
          total_experience_years?: number | null
          university_name?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          applicant_name_arabic?: string | null
          applicant_name_english?: string
          application_date?: string
          available_start_date?: string | null
          company_id?: string | null
          cover_letter_arabic?: string | null
          cover_letter_english?: string | null
          created_at?: string | null
          current_employer?: string | null
          current_job_title?: string | null
          current_salary?: number | null
          cv_file_url?: string | null
          date_of_birth?: string | null
          email?: string
          expected_salary?: number | null
          gender?: string | null
          graduation_year?: number | null
          highest_education?: string | null
          id?: string
          iqama_number?: string | null
          job_posting_id?: string
          major_field?: string | null
          marital_status?: string | null
          nationality?: string | null
          notice_period_days?: number | null
          passport_number?: string | null
          phone?: string | null
          portfolio_url?: string | null
          rejection_reason?: string | null
          relevant_experience_years?: number | null
          saudi_id?: string | null
          screened_by?: string | null
          screening_date?: string | null
          screening_notes?: string | null
          screening_score?: number | null
          status?: string | null
          total_experience_years?: number | null
          university_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_screened_by_fkey"
            columns: ["screened_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          age_max: number | null
          age_min: number | null
          application_deadline: string | null
          benefits_arabic: string | null
          benefits_english: string | null
          company_id: string
          created_at: string | null
          currency: string | null
          department_id: string | null
          education_level: string | null
          expected_start_date: string | null
          gender_preference: string | null
          hiring_manager_id: string | null
          hr_contact_id: string | null
          id: string
          job_description_arabic: string | null
          job_description_english: string | null
          job_reference_number: string | null
          job_title_arabic: string
          job_title_english: string
          max_experience_years: number | null
          min_experience_years: number | null
          number_of_positions: number | null
          position_id: string | null
          posting_date: string
          published_on: string[] | null
          qualifications_arabic: string | null
          qualifications_english: string | null
          responsibilities_arabic: string | null
          responsibilities_english: string | null
          salary_max: number | null
          salary_min: number | null
          saudi_national_preferred: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          application_deadline?: string | null
          benefits_arabic?: string | null
          benefits_english?: string | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          department_id?: string | null
          education_level?: string | null
          expected_start_date?: string | null
          gender_preference?: string | null
          hiring_manager_id?: string | null
          hr_contact_id?: string | null
          id?: string
          job_description_arabic?: string | null
          job_description_english?: string | null
          job_reference_number?: string | null
          job_title_arabic: string
          job_title_english: string
          max_experience_years?: number | null
          min_experience_years?: number | null
          number_of_positions?: number | null
          position_id?: string | null
          posting_date: string
          published_on?: string[] | null
          qualifications_arabic?: string | null
          qualifications_english?: string | null
          responsibilities_arabic?: string | null
          responsibilities_english?: string | null
          salary_max?: number | null
          salary_min?: number | null
          saudi_national_preferred?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          application_deadline?: string | null
          benefits_arabic?: string | null
          benefits_english?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          department_id?: string | null
          education_level?: string | null
          expected_start_date?: string | null
          gender_preference?: string | null
          hiring_manager_id?: string | null
          hr_contact_id?: string | null
          id?: string
          job_description_arabic?: string | null
          job_description_english?: string | null
          job_reference_number?: string | null
          job_title_arabic?: string
          job_title_english?: string
          max_experience_years?: number | null
          min_experience_years?: number | null
          number_of_positions?: number | null
          position_id?: string | null
          posting_date?: string
          published_on?: string[] | null
          qualifications_arabic?: string | null
          qualifications_english?: string | null
          responsibilities_arabic?: string | null
          responsibilities_english?: string | null
          salary_max?: number | null
          salary_min?: number | null
          saudi_national_preferred?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_hiring_manager_id_fkey"
            columns: ["hiring_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_hr_contact_id_fkey"
            columns: ["hr_contact_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_title_kpis: {
        Row: {
          created_at: string
          custom_target: number | null
          id: string
          is_active: boolean
          is_mandatory: boolean
          job_title_id: string
          kpi_id: string
          updated_at: string
          weight_override: number | null
        }
        Insert: {
          created_at?: string
          custom_target?: number | null
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          job_title_id: string
          kpi_id: string
          updated_at?: string
          weight_override?: number | null
        }
        Update: {
          created_at?: string
          custom_target?: number | null
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          job_title_id?: string
          kpi_id?: string
          updated_at?: string
          weight_override?: number | null
        }
        Relationships: []
      }
      job_titles: {
        Row: {
          company_id: string
          created_at: string
          department: string
          description: string | null
          id: string
          is_active: boolean
          level: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          department: string
          description?: string | null
          id?: string
          is_active?: boolean
          level: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          department?: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpi_measurements: {
        Row: {
          created_at: string | null
          id: string
          kpi_id: string | null
          measured_value: number
          measurement_date: string | null
          measurement_source: string | null
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          measured_value: number
          measurement_date?: string | null
          measurement_source?: string | null
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          measured_value?: number
          measurement_date?: string | null
          measurement_source?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_measurements_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "module_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_engagement_insights: {
        Row: {
          company_id: string | null
          created_at: string | null
          employee_id: string
          engagement_impact_on_learning: number | null
          id: string
          learning_engagement_score: number | null
          learning_impact_on_engagement: number | null
          recommended_engagement_actions: Json | null
          recommended_learning_actions: Json | null
          skills_completion_rate: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          employee_id: string
          engagement_impact_on_learning?: number | null
          id?: string
          learning_engagement_score?: number | null
          learning_impact_on_engagement?: number | null
          recommended_engagement_actions?: Json | null
          recommended_learning_actions?: Json | null
          skills_completion_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          employee_id?: string
          engagement_impact_on_learning?: number | null
          id?: string
          learning_engagement_score?: number | null
          learning_impact_on_engagement?: number | null
          recommended_engagement_actions?: Json | null
          recommended_learning_actions?: Json | null
          skills_completion_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_progress_tracking: {
        Row: {
          company_id: string | null
          completion_percentage: number | null
          created_at: string | null
          current_level: number | null
          employee_id: string | null
          engagement_correlation: number | null
          id: string
          last_activity_date: string | null
          learning_streak_days: number | null
          skill_category: string | null
          skill_name: string
          target_level: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_level?: number | null
          employee_id?: string | null
          engagement_correlation?: number | null
          id?: string
          last_activity_date?: string | null
          learning_streak_days?: number | null
          skill_category?: string | null
          skill_name: string
          target_level?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_level?: number | null
          employee_id?: string | null
          engagement_correlation?: number | null
          id?: string
          last_activity_date?: string | null
          learning_streak_days?: number | null
          skill_category?: string | null
          skill_name?: string
          target_level?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          accrual_rate: number | null
          carried_forward: number | null
          company_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          last_accrual_date: string | null
          leave_type: string
          remaining_days: number | null
          total_entitlement: number | null
          updated_at: string | null
          used_days: number | null
          year: number
        }
        Insert: {
          accrual_rate?: number | null
          carried_forward?: number | null
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_accrual_date?: string | null
          leave_type: string
          remaining_days?: number | null
          total_entitlement?: number | null
          updated_at?: string | null
          used_days?: number | null
          year: number
        }
        Update: {
          accrual_rate?: number | null
          carried_forward?: number | null
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_accrual_date?: string | null
          leave_type?: string
          remaining_days?: number | null
          total_entitlement?: number | null
          updated_at?: string | null
          used_days?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          actual_return_date: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          current_approver_id: string | null
          days_requested: number
          emergency_contact_person: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          end_date: string
          expected_return_date: string | null
          extension_requested: boolean | null
          final_approver_id: string | null
          hijri_end_date: string | null
          hijri_start_date: string | null
          hr_comments: string | null
          hr_processed_by: string | null
          hr_processing_date: string | null
          id: string
          leave_type: string
          reason: string | null
          reason_arabic: string | null
          reason_english: string | null
          rejection_reason: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          actual_return_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          current_approver_id?: string | null
          days_requested: number
          emergency_contact_person?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          end_date: string
          expected_return_date?: string | null
          extension_requested?: boolean | null
          final_approver_id?: string | null
          hijri_end_date?: string | null
          hijri_start_date?: string | null
          hr_comments?: string | null
          hr_processed_by?: string | null
          hr_processing_date?: string | null
          id?: string
          leave_type: string
          reason?: string | null
          reason_arabic?: string | null
          reason_english?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          actual_return_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          current_approver_id?: string | null
          days_requested?: number
          emergency_contact_person?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          end_date?: string
          expected_return_date?: string | null
          extension_requested?: boolean | null
          final_approver_id?: string | null
          hijri_end_date?: string | null
          hijri_start_date?: string | null
          hr_comments?: string | null
          hr_processed_by?: string | null
          hr_processing_date?: string | null
          id?: string
          leave_type?: string
          reason?: string | null
          reason_arabic?: string | null
          reason_english?: string | null
          rejection_reason?: string | null
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
            foreignKeyName: "leave_requests_current_approver_id_fkey"
            columns: ["current_approver_id"]
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
          {
            foreignKeyName: "leave_requests_final_approver_id_fkey"
            columns: ["final_approver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_hr_processed_by_fkey"
            columns: ["hr_processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          annual_entitlement_days: number | null
          approval_levels: number | null
          auto_approve: boolean | null
          company_id: string
          created_at: string | null
          gender_restriction: string | null
          id: string
          is_annual_leave: boolean | null
          is_bereavement_leave: boolean | null
          is_emergency_leave: boolean | null
          is_hajj_leave: boolean | null
          is_maternity_leave: boolean | null
          is_paid: boolean | null
          is_paternity_leave: boolean | null
          is_sick_leave: boolean | null
          leave_type_code: string | null
          leave_type_name_arabic: string
          leave_type_name_english: string
          max_carryover_days: number | null
          max_consecutive_days: number | null
          min_notice_days: number | null
          min_service_months: number | null
          nationality_restriction: string | null
          pay_percentage: number | null
          requires_approval: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          annual_entitlement_days?: number | null
          approval_levels?: number | null
          auto_approve?: boolean | null
          company_id: string
          created_at?: string | null
          gender_restriction?: string | null
          id?: string
          is_annual_leave?: boolean | null
          is_bereavement_leave?: boolean | null
          is_emergency_leave?: boolean | null
          is_hajj_leave?: boolean | null
          is_maternity_leave?: boolean | null
          is_paid?: boolean | null
          is_paternity_leave?: boolean | null
          is_sick_leave?: boolean | null
          leave_type_code?: string | null
          leave_type_name_arabic: string
          leave_type_name_english: string
          max_carryover_days?: number | null
          max_consecutive_days?: number | null
          min_notice_days?: number | null
          min_service_months?: number | null
          nationality_restriction?: string | null
          pay_percentage?: number | null
          requires_approval?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_entitlement_days?: number | null
          approval_levels?: number | null
          auto_approve?: boolean | null
          company_id?: string
          created_at?: string | null
          gender_restriction?: string | null
          id?: string
          is_annual_leave?: boolean | null
          is_bereavement_leave?: boolean | null
          is_emergency_leave?: boolean | null
          is_hajj_leave?: boolean | null
          is_maternity_leave?: boolean | null
          is_paid?: boolean | null
          is_paternity_leave?: boolean | null
          is_sick_leave?: boolean | null
          leave_type_code?: string | null
          leave_type_name_arabic?: string
          leave_type_name_english?: string
          max_carryover_days?: number | null
          max_consecutive_days?: number | null
          min_notice_days?: number | null
          min_service_months?: number | null
          nationality_restriction?: string | null
          pay_percentage?: number | null
          requires_approval?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_attendance_sessions: {
        Row: {
          break_duration: number | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          device_info: Json
          employee_id: string | null
          id: string
          location_accuracy: number | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          overtime_hours: number | null
          photo_check_in_url: string | null
          photo_check_out_url: string | null
          status: string | null
          sync_status: string | null
          updated_at: string | null
          work_hours: number | null
        }
        Insert: {
          break_duration?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          device_info: Json
          employee_id?: string | null
          id?: string
          location_accuracy?: number | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          overtime_hours?: number | null
          photo_check_in_url?: string | null
          photo_check_out_url?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string | null
          work_hours?: number | null
        }
        Update: {
          break_duration?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          device_info?: Json
          employee_id?: string | null
          id?: string
          location_accuracy?: number | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          overtime_hours?: number | null
          photo_check_in_url?: string | null
          photo_check_out_url?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string | null
          work_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mobile_attendance_sessions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_devices: {
        Row: {
          app_version: string | null
          created_at: string | null
          device_id: string
          device_name: string
          device_type: string
          employee_id: string | null
          id: string
          is_active: boolean | null
          last_seen: string | null
          os_version: string | null
          push_token: string | null
        }
        Insert: {
          app_version?: string | null
          created_at?: string | null
          device_id: string
          device_name: string
          device_type: string
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          os_version?: string | null
          push_token?: string | null
        }
        Update: {
          app_version?: string | null
          created_at?: string | null
          device_id?: string
          device_name?: string
          device_type?: string
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          os_version?: string | null
          push_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mobile_devices_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      module_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          name_ar: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          name_ar?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          name_ar?: string | null
        }
        Relationships: []
      }
      module_kpis: {
        Row: {
          calculation_method: string | null
          created_at: string | null
          current_value: number | null
          id: string
          is_active: boolean | null
          kpi_name: string
          kpi_name_ar: string | null
          kpi_order: number
          module_id: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          calculation_method?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          kpi_name: string
          kpi_name_ar?: string | null
          kpi_order: number
          module_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          calculation_method?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          kpi_name?: string
          kpi_name_ar?: string | null
          kpi_order?: number
          module_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_kpis_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category_id: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "module_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      nitaqat_tracking: {
        Row: {
          company_id: string | null
          compliance_status: string | null
          created_at: string | null
          hijri_reporting_period: string | null
          id: string
          incentives: number | null
          mol_response: string | null
          nitaqat_color: string
          non_saudi_employees: number
          penalties: number | null
          reporting_period: string
          required_saudization_ratio: number
          saudi_employees: number
          saudization_ratio: number
          submission_date: string | null
          submitted_to_mol: boolean | null
          total_employees: number
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          compliance_status?: string | null
          created_at?: string | null
          hijri_reporting_period?: string | null
          id?: string
          incentives?: number | null
          mol_response?: string | null
          nitaqat_color: string
          non_saudi_employees: number
          penalties?: number | null
          reporting_period: string
          required_saudization_ratio: number
          saudi_employees: number
          saudization_ratio: number
          submission_date?: string | null
          submitted_to_mol?: boolean | null
          total_employees: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          compliance_status?: string | null
          created_at?: string | null
          hijri_reporting_period?: string | null
          id?: string
          incentives?: number | null
          mol_response?: string | null
          nitaqat_color?: string
          non_saudi_employees?: number
          penalties?: number | null
          reporting_period?: string
          required_saudization_ratio?: number
          saudi_employees?: number
          saudization_ratio?: number
          submission_date?: string | null
          submitted_to_mol?: boolean | null
          total_employees?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      overtime_records: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          company_id: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          holiday_overtime_hours: number | null
          id: string
          overtime_amount: number | null
          overtime_rate: number | null
          regular_overtime_hours: number | null
          timesheet_id: string | null
          year_to_date_overtime: number | null
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          holiday_overtime_hours?: number | null
          id?: string
          overtime_amount?: number | null
          overtime_rate?: number | null
          regular_overtime_hours?: number | null
          timesheet_id?: string | null
          year_to_date_overtime?: number | null
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          holiday_overtime_hours?: number | null
          id?: string
          overtime_amount?: number | null
          overtime_rate?: number | null
          regular_overtime_hours?: number | null
          timesheet_id?: string | null
          year_to_date_overtime?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "overtime_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_records_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "attendance_timesheet"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          hyperpay_checkout_id: string | null
          hyperpay_payment_id: string | null
          id: string
          invoice_number: string | null
          payment_method: string | null
          payment_type: string
          status: string | null
          subscription_id: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
          vat_amount: number | null
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hyperpay_checkout_id?: string | null
          hyperpay_payment_id?: string | null
          id?: string
          invoice_number?: string | null
          payment_method?: string | null
          payment_type: string
          status?: string | null
          subscription_id?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hyperpay_checkout_id?: string | null
          hyperpay_payment_id?: string | null
          id?: string
          invoice_number?: string | null
          payment_method?: string | null
          payment_type?: string
          status?: string | null
          subscription_id?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          absence_days: number | null
          actual_working_days: number | null
          advance_deduction: number | null
          allowances: number | null
          bank_account_number: string | null
          basic_salary: number
          bonus_amount: number | null
          commission_amount: number | null
          communication_allowance: number | null
          company_id: string | null
          created_at: string | null
          deductions: number | null
          employee_id: string | null
          food_allowance: number | null
          gosi_employee: number | null
          gosi_employer: number | null
          housing_allowance: number | null
          id: string
          income_tax: number | null
          loan_deduction: number | null
          month: number
          net_salary: number
          other_allowances: number | null
          other_deductions: number | null
          overtime: number | null
          payment_method: string | null
          payroll_period_id: string | null
          processed_at: string | null
          transportation_allowance: number | null
          working_days: number | null
          wps_status: string | null
          year: number
        }
        Insert: {
          absence_days?: number | null
          actual_working_days?: number | null
          advance_deduction?: number | null
          allowances?: number | null
          bank_account_number?: string | null
          basic_salary: number
          bonus_amount?: number | null
          commission_amount?: number | null
          communication_allowance?: number | null
          company_id?: string | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          food_allowance?: number | null
          gosi_employee?: number | null
          gosi_employer?: number | null
          housing_allowance?: number | null
          id?: string
          income_tax?: number | null
          loan_deduction?: number | null
          month: number
          net_salary: number
          other_allowances?: number | null
          other_deductions?: number | null
          overtime?: number | null
          payment_method?: string | null
          payroll_period_id?: string | null
          processed_at?: string | null
          transportation_allowance?: number | null
          working_days?: number | null
          wps_status?: string | null
          year: number
        }
        Update: {
          absence_days?: number | null
          actual_working_days?: number | null
          advance_deduction?: number | null
          allowances?: number | null
          bank_account_number?: string | null
          basic_salary?: number
          bonus_amount?: number | null
          commission_amount?: number | null
          communication_allowance?: number | null
          company_id?: string | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          food_allowance?: number | null
          gosi_employee?: number | null
          gosi_employer?: number | null
          housing_allowance?: number | null
          id?: string
          income_tax?: number | null
          loan_deduction?: number | null
          month?: number
          net_salary?: number
          other_allowances?: number | null
          other_deductions?: number | null
          overtime?: number | null
          payment_method?: string | null
          payroll_period_id?: string | null
          processed_at?: string | null
          transportation_allowance?: number | null
          working_days?: number | null
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
          {
            foreignKeyName: "payroll_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          company_id: string
          created_at: string | null
          cutoff_date: string | null
          gregorian_end_date: string
          gregorian_start_date: string
          hijri_month: string | null
          hijri_year: string | null
          id: string
          payment_date: string | null
          payroll_type: string | null
          period_name: string
          processed_by: string | null
          status: string | null
          total_deductions: number | null
          total_gosi_employee: number | null
          total_gosi_employer: number | null
          total_gross_salary: number | null
          total_net_salary: number | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string | null
          cutoff_date?: string | null
          gregorian_end_date: string
          gregorian_start_date: string
          hijri_month?: string | null
          hijri_year?: string | null
          id?: string
          payment_date?: string | null
          payroll_type?: string | null
          period_name: string
          processed_by?: string | null
          status?: string | null
          total_deductions?: number | null
          total_gosi_employee?: number | null
          total_gosi_employer?: number | null
          total_gross_salary?: number | null
          total_net_salary?: number | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string | null
          cutoff_date?: string | null
          gregorian_end_date?: string
          gregorian_start_date?: string
          hijri_month?: string | null
          hijri_year?: string | null
          id?: string
          payment_date?: string | null
          payroll_type?: string | null
          period_name?: string
          processed_by?: string | null
          status?: string | null
          total_deductions?: number | null
          total_gosi_employee?: number | null
          total_gosi_employer?: number | null
          total_gross_salary?: number | null
          total_net_salary?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_periods_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_agreements: {
        Row: {
          agreement_period: string
          company_id: string
          created_at: string
          current_achievement: number
          employee_id: string
          id: string
          overall_target: number
          review_date: string | null
          signed_date: string | null
          status: string
          total_kpis: number
          total_weight: number
          updated_at: string
        }
        Insert: {
          agreement_period: string
          company_id: string
          created_at?: string
          current_achievement?: number
          employee_id: string
          id?: string
          overall_target?: number
          review_date?: string | null
          signed_date?: string | null
          status?: string
          total_kpis?: number
          total_weight?: number
          updated_at?: string
        }
        Update: {
          agreement_period?: string
          company_id?: string
          created_at?: string
          current_achievement?: number
          employee_id?: string
          id?: string
          overall_target?: number
          review_date?: string | null
          signed_date?: string | null
          status?: string
          total_kpis?: number
          total_weight?: number
          updated_at?: string
        }
        Relationships: []
      }
      performance_cycles: {
        Row: {
          company_id: string
          created_at: string | null
          cycle_name_arabic: string
          cycle_name_english: string
          cycle_type: string | null
          cycle_year: number
          end_date: string
          final_review_deadline: string | null
          goal_setting_enabled: boolean | null
          id: string
          manager_review_deadline: string | null
          peer_feedback_enabled: boolean | null
          self_assessment_deadline: string | null
          self_assessment_enabled: boolean | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          cycle_name_arabic: string
          cycle_name_english: string
          cycle_type?: string | null
          cycle_year: number
          end_date: string
          final_review_deadline?: string | null
          goal_setting_enabled?: boolean | null
          id?: string
          manager_review_deadline?: string | null
          peer_feedback_enabled?: boolean | null
          self_assessment_deadline?: string | null
          self_assessment_enabled?: boolean | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          cycle_name_arabic?: string
          cycle_name_english?: string
          cycle_type?: string | null
          cycle_year?: number
          end_date?: string
          final_review_deadline?: string | null
          goal_setting_enabled?: boolean | null
          id?: string
          manager_review_deadline?: string | null
          peer_feedback_enabled?: boolean | null
          self_assessment_deadline?: string | null
          self_assessment_enabled?: boolean | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          achievements: Json | null
          achievements_arabic: string | null
          achievements_english: string | null
          areas_for_improvement_arabic: string | null
          areas_for_improvement_english: string | null
          communication_skills_rating: number | null
          created_at: string | null
          development_goals_arabic: string | null
          development_goals_english: string | null
          employee_acknowledgment: boolean | null
          employee_acknowledgment_date: string | null
          employee_id: string | null
          final_approval_date: string | null
          goals: Json | null
          hr_approved_by: string | null
          hr_review_date: string | null
          id: string
          initiative_rating: number | null
          kpis: Json | null
          leadership_skills_rating: number | null
          manager_review_date: string | null
          overall_rating: number | null
          performance_cycle_id: string | null
          problem_solving_rating: number | null
          reliability_rating: number | null
          review_period: string
          review_type: string | null
          reviewer_id: string | null
          self_assessment_date: string | null
          self_comment_arabic: string | null
          self_comment_english: string | null
          self_rating: number | null
          status: string | null
          strengths_arabic: string | null
          strengths_english: string | null
          teamwork_rating: number | null
          technical_skills_rating: number | null
          updated_at: string | null
        }
        Insert: {
          achievements?: Json | null
          achievements_arabic?: string | null
          achievements_english?: string | null
          areas_for_improvement_arabic?: string | null
          areas_for_improvement_english?: string | null
          communication_skills_rating?: number | null
          created_at?: string | null
          development_goals_arabic?: string | null
          development_goals_english?: string | null
          employee_acknowledgment?: boolean | null
          employee_acknowledgment_date?: string | null
          employee_id?: string | null
          final_approval_date?: string | null
          goals?: Json | null
          hr_approved_by?: string | null
          hr_review_date?: string | null
          id?: string
          initiative_rating?: number | null
          kpis?: Json | null
          leadership_skills_rating?: number | null
          manager_review_date?: string | null
          overall_rating?: number | null
          performance_cycle_id?: string | null
          problem_solving_rating?: number | null
          reliability_rating?: number | null
          review_period: string
          review_type?: string | null
          reviewer_id?: string | null
          self_assessment_date?: string | null
          self_comment_arabic?: string | null
          self_comment_english?: string | null
          self_rating?: number | null
          status?: string | null
          strengths_arabic?: string | null
          strengths_english?: string | null
          teamwork_rating?: number | null
          technical_skills_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          achievements?: Json | null
          achievements_arabic?: string | null
          achievements_english?: string | null
          areas_for_improvement_arabic?: string | null
          areas_for_improvement_english?: string | null
          communication_skills_rating?: number | null
          created_at?: string | null
          development_goals_arabic?: string | null
          development_goals_english?: string | null
          employee_acknowledgment?: boolean | null
          employee_acknowledgment_date?: string | null
          employee_id?: string | null
          final_approval_date?: string | null
          goals?: Json | null
          hr_approved_by?: string | null
          hr_review_date?: string | null
          id?: string
          initiative_rating?: number | null
          kpis?: Json | null
          leadership_skills_rating?: number | null
          manager_review_date?: string | null
          overall_rating?: number | null
          performance_cycle_id?: string | null
          problem_solving_rating?: number | null
          reliability_rating?: number | null
          review_period?: string
          review_type?: string | null
          reviewer_id?: string | null
          self_assessment_date?: string | null
          self_comment_arabic?: string | null
          self_comment_english?: string | null
          self_rating?: number | null
          status?: string | null
          strengths_arabic?: string | null
          strengths_english?: string | null
          teamwork_rating?: number | null
          technical_skills_rating?: number | null
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
            foreignKeyName: "performance_reviews_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_performance_cycle_id_fkey"
            columns: ["performance_cycle_id"]
            isOneToOne: false
            referencedRelation: "performance_cycles"
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
      pilot_group_users: {
        Row: {
          access_level: string | null
          added_by: string | null
          company_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          pilot_features: string[] | null
          user_id: string
        }
        Insert: {
          access_level?: string | null
          added_by?: string | null
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          pilot_features?: string[] | null
          user_id: string
        }
        Update: {
          access_level?: string | null
          added_by?: string | null
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          pilot_features?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          company_id: string
          created_at: string | null
          currency: string | null
          department_id: string | null
          description_arabic: string | null
          description_english: string | null
          education_level: string | null
          experience_years_max: number | null
          experience_years_min: number | null
          id: string
          job_family: string | null
          job_grade: string | null
          job_level: number | null
          position_code: string | null
          position_title_arabic: string
          position_title_english: string
          qualifications_arabic: string | null
          qualifications_english: string | null
          responsibilities_arabic: string | null
          responsibilities_english: string | null
          salary_max: number | null
          salary_min: number | null
          saudi_national_required: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          currency?: string | null
          department_id?: string | null
          description_arabic?: string | null
          description_english?: string | null
          education_level?: string | null
          experience_years_max?: number | null
          experience_years_min?: number | null
          id?: string
          job_family?: string | null
          job_grade?: string | null
          job_level?: number | null
          position_code?: string | null
          position_title_arabic: string
          position_title_english: string
          qualifications_arabic?: string | null
          qualifications_english?: string | null
          responsibilities_arabic?: string | null
          responsibilities_english?: string | null
          salary_max?: number | null
          salary_min?: number | null
          saudi_national_required?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          currency?: string | null
          department_id?: string | null
          description_arabic?: string | null
          description_english?: string | null
          education_level?: string | null
          experience_years_max?: number | null
          experience_years_min?: number | null
          id?: string
          job_family?: string | null
          job_grade?: string | null
          job_level?: number | null
          position_code?: string | null
          position_title_arabic?: string
          position_title_english?: string
          qualifications_arabic?: string | null
          qualifications_english?: string | null
          responsibilities_arabic?: string | null
          responsibilities_english?: string | null
          salary_max?: number | null
          salary_min?: number | null
          saudi_national_required?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saudi_activities: {
        Row: {
          classification_code: string
          created_at: string
          id: string
          name_ar: string
          name_en: string
          sector_id: string
          updated_at: string
        }
        Insert: {
          classification_code: string
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          sector_id: string
          updated_at?: string
        }
        Update: {
          classification_code?: string
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          sector_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saudi_activities_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "saudi_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      saudi_cities: {
        Row: {
          code: string
          created_at: string
          id: string
          name_ar: string
          name_en: string
          region_id: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          region_id: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          region_id?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saudi_cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "saudi_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      saudi_compliance_logs: {
        Row: {
          ai_provider_used: string | null
          company_id: string | null
          compliance_status: string
          created_at: string
          event_type: string
          id: string
          ip_address: unknown | null
          query_hash: string | null
          redacted_items_count: number | null
          sensitive_data_detected: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ai_provider_used?: string | null
          company_id?: string | null
          compliance_status: string
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          query_hash?: string | null
          redacted_items_count?: number | null
          sensitive_data_detected?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ai_provider_used?: string | null
          company_id?: string | null
          compliance_status?: string
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          query_hash?: string | null
          redacted_items_count?: number | null
          sensitive_data_detected?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saudi_data_protection_config: {
        Row: {
          audit_level: string | null
          company_id: string
          compliance_officer_contact: string | null
          created_at: string
          cross_border_transfer_allowed: boolean | null
          data_classification_level: string
          encryption_required: boolean | null
          id: string
          last_compliance_review: string | null
          next_compliance_review: string | null
          retention_period_years: number | null
          updated_at: string
        }
        Insert: {
          audit_level?: string | null
          company_id: string
          compliance_officer_contact?: string | null
          created_at?: string
          cross_border_transfer_allowed?: boolean | null
          data_classification_level?: string
          encryption_required?: boolean | null
          id?: string
          last_compliance_review?: string | null
          next_compliance_review?: string | null
          retention_period_years?: number | null
          updated_at?: string
        }
        Update: {
          audit_level?: string | null
          company_id?: string
          compliance_officer_contact?: string | null
          created_at?: string
          cross_border_transfer_allowed?: boolean | null
          data_classification_level?: string
          encryption_required?: boolean | null
          id?: string
          last_compliance_review?: string | null
          next_compliance_review?: string | null
          retention_period_years?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      saudi_departments: {
        Row: {
          cost_center: string | null
          created_at: string | null
          current_saudization_ratio: number | null
          department_code: string
          department_name_ar: string
          department_name_en: string
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean | null
          location: string | null
          manager_employee_id: string | null
          parent_department_id: string | null
          saudization_target: number | null
          updated_at: string | null
        }
        Insert: {
          cost_center?: string | null
          created_at?: string | null
          current_saudization_ratio?: number | null
          department_code: string
          department_name_ar: string
          department_name_en: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          manager_employee_id?: string | null
          parent_department_id?: string | null
          saudization_target?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_center?: string | null
          created_at?: string | null
          current_saudization_ratio?: number | null
          department_code?: string
          department_name_ar?: string
          department_name_en?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          manager_employee_id?: string | null
          parent_department_id?: string | null
          saudization_target?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saudi_documents: {
        Row: {
          compliance_status: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          document_category: string
          document_number: string | null
          document_type: string
          employee_id: string | null
          expiry_date: string | null
          file_name: string
          file_path: string
          file_size: number | null
          hijri_expiry_date: string | null
          hijri_issue_date: string | null
          id: string
          is_active: boolean | null
          is_government_required: boolean | null
          issue_date: string | null
          mime_type: string | null
          title_ar: string | null
          title_en: string
          updated_at: string | null
          uploaded_by: string | null
          verification_status: string | null
        }
        Insert: {
          compliance_status?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          document_category: string
          document_number?: string | null
          document_type: string
          employee_id?: string | null
          expiry_date?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          hijri_expiry_date?: string | null
          hijri_issue_date?: string | null
          id?: string
          is_active?: boolean | null
          is_government_required?: boolean | null
          issue_date?: string | null
          mime_type?: string | null
          title_ar?: string | null
          title_en: string
          updated_at?: string | null
          uploaded_by?: string | null
          verification_status?: string | null
        }
        Update: {
          compliance_status?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          document_category?: string
          document_number?: string | null
          document_type?: string
          employee_id?: string | null
          expiry_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          hijri_expiry_date?: string | null
          hijri_issue_date?: string | null
          id?: string
          is_active?: boolean | null
          is_government_required?: boolean | null
          issue_date?: string | null
          mime_type?: string | null
          title_ar?: string | null
          title_en?: string
          updated_at?: string | null
          uploaded_by?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      saudi_employees: {
        Row: {
          absher_verification_status: string | null
          address_line1: string | null
          address_line2: string | null
          arabic_family_name: string | null
          arabic_first_name: string
          arabic_last_name: string
          arabic_middle_name: string | null
          basic_salary: number | null
          city: string | null
          company_id: string | null
          contract_type: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          department_id: string | null
          education_level: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_number: string
          employment_status: string | null
          employment_type: string | null
          english_first_name: string
          english_last_name: string
          english_middle_name: string | null
          gosi_compliance_status: string | null
          gosi_registration_number: string | null
          gregorian_birth_date: string
          gregorian_hire_date: string
          hijri_birth_date: string | null
          hijri_hire_date: string | null
          id: string
          iqama_expiry_date: string | null
          iqama_number: string | null
          is_saudi_national: boolean | null
          mol_compliance_status: string | null
          mol_employee_code: string | null
          nationality: string
          nitaqat_category: string | null
          nitaqat_id: string | null
          passport_number: string | null
          phone: string | null
          position_title: string | null
          position_title_ar: string | null
          postal_code: string | null
          province: string | null
          qiwa_compliance_status: string | null
          qiwa_permit_number: string | null
          saudi_national_id: string | null
          saudization_status: string | null
          skill_level: string | null
          termination_date: string | null
          termination_reason: string | null
          updated_at: string | null
          updated_by: string | null
          visa_expiry_date: string | null
          visa_number: string | null
          visa_type: string | null
          work_permit_expiry_date: string | null
        }
        Insert: {
          absher_verification_status?: string | null
          address_line1?: string | null
          address_line2?: string | null
          arabic_family_name?: string | null
          arabic_first_name: string
          arabic_last_name: string
          arabic_middle_name?: string | null
          basic_salary?: number | null
          city?: string | null
          company_id?: string | null
          contract_type?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          department_id?: string | null
          education_level?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_number: string
          employment_status?: string | null
          employment_type?: string | null
          english_first_name: string
          english_last_name: string
          english_middle_name?: string | null
          gosi_compliance_status?: string | null
          gosi_registration_number?: string | null
          gregorian_birth_date: string
          gregorian_hire_date: string
          hijri_birth_date?: string | null
          hijri_hire_date?: string | null
          id?: string
          iqama_expiry_date?: string | null
          iqama_number?: string | null
          is_saudi_national?: boolean | null
          mol_compliance_status?: string | null
          mol_employee_code?: string | null
          nationality: string
          nitaqat_category?: string | null
          nitaqat_id?: string | null
          passport_number?: string | null
          phone?: string | null
          position_title?: string | null
          position_title_ar?: string | null
          postal_code?: string | null
          province?: string | null
          qiwa_compliance_status?: string | null
          qiwa_permit_number?: string | null
          saudi_national_id?: string | null
          saudization_status?: string | null
          skill_level?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
          visa_expiry_date?: string | null
          visa_number?: string | null
          visa_type?: string | null
          work_permit_expiry_date?: string | null
        }
        Update: {
          absher_verification_status?: string | null
          address_line1?: string | null
          address_line2?: string | null
          arabic_family_name?: string | null
          arabic_first_name?: string
          arabic_last_name?: string
          arabic_middle_name?: string | null
          basic_salary?: number | null
          city?: string | null
          company_id?: string | null
          contract_type?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          department_id?: string | null
          education_level?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_number?: string
          employment_status?: string | null
          employment_type?: string | null
          english_first_name?: string
          english_last_name?: string
          english_middle_name?: string | null
          gosi_compliance_status?: string | null
          gosi_registration_number?: string | null
          gregorian_birth_date?: string
          gregorian_hire_date?: string
          hijri_birth_date?: string | null
          hijri_hire_date?: string | null
          id?: string
          iqama_expiry_date?: string | null
          iqama_number?: string | null
          is_saudi_national?: boolean | null
          mol_compliance_status?: string | null
          mol_employee_code?: string | null
          nationality?: string
          nitaqat_category?: string | null
          nitaqat_id?: string | null
          passport_number?: string | null
          phone?: string | null
          position_title?: string | null
          position_title_ar?: string | null
          postal_code?: string | null
          province?: string | null
          qiwa_compliance_status?: string | null
          qiwa_permit_number?: string | null
          saudi_national_id?: string | null
          saudization_status?: string | null
          skill_level?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
          visa_expiry_date?: string | null
          visa_number?: string | null
          visa_type?: string | null
          work_permit_expiry_date?: string | null
        }
        Relationships: []
      }
      saudi_gov_entities: {
        Row: {
          created_at: string
          entity_key: string
          id: string
          name_ar: string
          name_en: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          entity_key: string
          id?: string
          name_ar: string
          name_en: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          entity_key?: string
          id?: string
          name_ar?: string
          name_en?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      saudi_leave_requests: {
        Row: {
          created_at: string | null
          employee_id: string
          end_date: string
          gosi_reported: boolean | null
          hijri_end_date: string | null
          hijri_start_date: string | null
          hr_approved_at: string | null
          hr_approved_by: string | null
          hr_notes: string | null
          id: string
          is_government_reportable: boolean | null
          leave_type_id: string
          manager_approved_at: string | null
          manager_approved_by: string | null
          manager_notes: string | null
          mol_reported: boolean | null
          reason_ar: string | null
          reason_en: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          start_date: string
          status: string | null
          submitted_date: string | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          end_date: string
          gosi_reported?: boolean | null
          hijri_end_date?: string | null
          hijri_start_date?: string | null
          hr_approved_at?: string | null
          hr_approved_by?: string | null
          hr_notes?: string | null
          id?: string
          is_government_reportable?: boolean | null
          leave_type_id: string
          manager_approved_at?: string | null
          manager_approved_by?: string | null
          manager_notes?: string | null
          mol_reported?: boolean | null
          reason_ar?: string | null
          reason_en?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string | null
          submitted_date?: string | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          end_date?: string
          gosi_reported?: boolean | null
          hijri_end_date?: string | null
          hijri_start_date?: string | null
          hr_approved_at?: string | null
          hr_approved_by?: string | null
          hr_notes?: string | null
          id?: string
          is_government_reportable?: boolean | null
          leave_type_id?: string
          manager_approved_at?: string | null
          manager_approved_by?: string | null
          manager_notes?: string | null
          mol_reported?: boolean | null
          reason_ar?: string | null
          reason_en?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string | null
          submitted_date?: string | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      saudi_payroll: {
        Row: {
          absence_deduction: number | null
          actual_working_days: number | null
          annual_leave_provision: number | null
          approved_at: string | null
          approved_by: string | null
          basic_salary: number
          bonus: number | null
          commission: number | null
          created_at: string | null
          employee_id: string
          end_of_service_provision: number | null
          food_allowance: number | null
          gosi_employee_contribution: number | null
          gosi_employer_contribution: number | null
          gosi_reported_at: string | null
          gross_salary: number | null
          housing_allowance: number | null
          id: string
          income_tax: number | null
          insurance_deduction: number | null
          is_government_reported: boolean | null
          late_deduction: number | null
          loan_deduction: number | null
          mobile_allowance: number | null
          mol_reported_at: string | null
          net_salary: number | null
          other_allowances: number | null
          other_deductions: number | null
          overtime_allowance: number | null
          overtime_hours: number | null
          pay_date: string | null
          payroll_month: number
          payroll_period_id: string | null
          payroll_year: number
          status: string | null
          total_deductions: number | null
          transportation_allowance: number | null
          updated_at: string | null
          working_days: number | null
        }
        Insert: {
          absence_deduction?: number | null
          actual_working_days?: number | null
          annual_leave_provision?: number | null
          approved_at?: string | null
          approved_by?: string | null
          basic_salary: number
          bonus?: number | null
          commission?: number | null
          created_at?: string | null
          employee_id: string
          end_of_service_provision?: number | null
          food_allowance?: number | null
          gosi_employee_contribution?: number | null
          gosi_employer_contribution?: number | null
          gosi_reported_at?: string | null
          gross_salary?: number | null
          housing_allowance?: number | null
          id?: string
          income_tax?: number | null
          insurance_deduction?: number | null
          is_government_reported?: boolean | null
          late_deduction?: number | null
          loan_deduction?: number | null
          mobile_allowance?: number | null
          mol_reported_at?: string | null
          net_salary?: number | null
          other_allowances?: number | null
          other_deductions?: number | null
          overtime_allowance?: number | null
          overtime_hours?: number | null
          pay_date?: string | null
          payroll_month: number
          payroll_period_id?: string | null
          payroll_year: number
          status?: string | null
          total_deductions?: number | null
          transportation_allowance?: number | null
          updated_at?: string | null
          working_days?: number | null
        }
        Update: {
          absence_deduction?: number | null
          actual_working_days?: number | null
          annual_leave_provision?: number | null
          approved_at?: string | null
          approved_by?: string | null
          basic_salary?: number
          bonus?: number | null
          commission?: number | null
          created_at?: string | null
          employee_id?: string
          end_of_service_provision?: number | null
          food_allowance?: number | null
          gosi_employee_contribution?: number | null
          gosi_employer_contribution?: number | null
          gosi_reported_at?: string | null
          gross_salary?: number | null
          housing_allowance?: number | null
          id?: string
          income_tax?: number | null
          insurance_deduction?: number | null
          is_government_reported?: boolean | null
          late_deduction?: number | null
          loan_deduction?: number | null
          mobile_allowance?: number | null
          mol_reported_at?: string | null
          net_salary?: number | null
          other_allowances?: number | null
          other_deductions?: number | null
          overtime_allowance?: number | null
          overtime_hours?: number | null
          pay_date?: string | null
          payroll_month?: number
          payroll_period_id?: string | null
          payroll_year?: number
          status?: string | null
          total_deductions?: number | null
          transportation_allowance?: number | null
          updated_at?: string | null
          working_days?: number | null
        }
        Relationships: []
      }
      saudi_regions: {
        Row: {
          code: string
          created_at: string
          id: string
          name_ar: string
          name_en: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      saudi_sectors: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
          sic_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          sic_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          sic_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      smart_kpis: {
        Row: {
          category: string
          company_id: string
          created_at: string
          data_source: string | null
          formula: string | null
          frequency: string
          id: string
          is_active: boolean
          kpi_description: string
          kpi_name: string
          measurement_unit: string
          target_value: number
          updated_at: string
          weight_percentage: number
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          data_source?: string | null
          formula?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          kpi_description: string
          kpi_name: string
          measurement_unit: string
          target_value: number
          updated_at?: string
          weight_percentage?: number
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          data_source?: string | null
          formula?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          kpi_description?: string
          kpi_name?: string
          measurement_unit?: string
          target_value?: number
          updated_at?: string
          weight_percentage?: number
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          description_ar: string | null
          description_en: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_employees: number | null
          max_modules: number | null
          name_ar: string
          name_en: string
          plan_code: string
          price_annual: number
          price_monthly: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          max_employees?: number | null
          max_modules?: number | null
          name_ar: string
          name_en: string
          plan_code: string
          price_annual: number
          price_monthly: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_employees?: number | null
          max_modules?: number | null
          name_ar?: string
          name_en?: string
          plan_code?: string
          price_annual?: number
          price_monthly?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          billing_cycle: string
          company_id: string | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          hyperpay_subscription_id: string | null
          id: string
          plan_type: string
          status: string | null
          trial_end_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          billing_cycle: string
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          hyperpay_subscription_id?: string | null
          id?: string
          plan_type: string
          status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_cycle?: string
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          hyperpay_subscription_id?: string | null
          id?: string
          plan_type?: string
          status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_adaptive_learning: {
        Row: {
          created_at: string
          id: string
          implementation_status: string | null
          improvement_suggestion: string | null
          improvement_suggestion_ar: string | null
          last_applied: string | null
          learning_category: string
          pattern_detected: string
          pattern_frequency: number | null
          success_rate: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          implementation_status?: string | null
          improvement_suggestion?: string | null
          improvement_suggestion_ar?: string | null
          last_applied?: string | null
          learning_category: string
          pattern_detected: string
          pattern_frequency?: number | null
          success_rate?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          implementation_status?: string | null
          improvement_suggestion?: string | null
          improvement_suggestion_ar?: string | null
          last_applied?: string | null
          learning_category?: string
          pattern_detected?: string
          pattern_frequency?: number | null
          success_rate?: number | null
        }
        Relationships: []
      }
      system_diagnostics: {
        Row: {
          ai_confidence_score: number | null
          auto_fixable: boolean | null
          company_id: string | null
          created_at: string
          diagnostic_type: string
          fix_applied: boolean | null
          id: string
          issue_description: string
          issue_description_ar: string | null
          module_id: string | null
          recommended_action: string | null
          recommended_action_ar: string | null
          resolved_at: string | null
          severity_level: string
        }
        Insert: {
          ai_confidence_score?: number | null
          auto_fixable?: boolean | null
          company_id?: string | null
          created_at?: string
          diagnostic_type: string
          fix_applied?: boolean | null
          id?: string
          issue_description: string
          issue_description_ar?: string | null
          module_id?: string | null
          recommended_action?: string | null
          recommended_action_ar?: string | null
          resolved_at?: string | null
          severity_level?: string
        }
        Update: {
          ai_confidence_score?: number | null
          auto_fixable?: boolean | null
          company_id?: string | null
          created_at?: string
          diagnostic_type?: string
          fix_applied?: boolean | null
          id?: string
          issue_description?: string
          issue_description_ar?: string | null
          module_id?: string | null
          recommended_action?: string | null
          recommended_action_ar?: string | null
          resolved_at?: string | null
          severity_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_diagnostics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_diagnostics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health_reports: {
        Row: {
          company_id: string | null
          compliance_status: string | null
          created_at: string
          critical_issues_count: number | null
          generated_by: string | null
          id: string
          module_scores: Json
          next_scheduled_check: string | null
          optimization_opportunities_count: number | null
          overall_health_score: number
          recommendations: Json
          recommendations_ar: Json
          report_type: string
          security_alerts_count: number | null
        }
        Insert: {
          company_id?: string | null
          compliance_status?: string | null
          created_at?: string
          critical_issues_count?: number | null
          generated_by?: string | null
          id?: string
          module_scores?: Json
          next_scheduled_check?: string | null
          optimization_opportunities_count?: number | null
          overall_health_score?: number
          recommendations?: Json
          recommendations_ar?: Json
          report_type?: string
          security_alerts_count?: number | null
        }
        Update: {
          company_id?: string | null
          compliance_status?: string | null
          created_at?: string
          critical_issues_count?: number | null
          generated_by?: string | null
          id?: string
          module_scores?: Json
          next_scheduled_check?: string | null
          optimization_opportunities_count?: number | null
          overall_health_score?: number
          recommendations?: Json
          recommendations_ar?: Json
          report_type?: string
          security_alerts_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_health_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_modules_registry: {
        Row: {
          auto_discovered: boolean | null
          compliance_score: number | null
          created_at: string
          discovery_date: string
          health_status: string | null
          id: string
          last_health_check: string | null
          metadata: Json | null
          module_category: string
          module_name: string
          module_path: string
          performance_score: number | null
          security_score: number | null
          updated_at: string
        }
        Insert: {
          auto_discovered?: boolean | null
          compliance_score?: number | null
          created_at?: string
          discovery_date?: string
          health_status?: string | null
          id?: string
          last_health_check?: string | null
          metadata?: Json | null
          module_category: string
          module_name: string
          module_path: string
          performance_score?: number | null
          security_score?: number | null
          updated_at?: string
        }
        Update: {
          auto_discovered?: boolean | null
          compliance_score?: number | null
          created_at?: string
          discovery_date?: string
          health_status?: string | null
          id?: string
          last_health_check?: string | null
          metadata?: Json | null
          module_category?: string
          module_name?: string
          module_path?: string
          performance_score?: number | null
          security_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          company_id: string | null
          created_at: string | null
          description_arabic: string | null
          description_english: string | null
          id: string
          is_editable: boolean | null
          is_system_setting: boolean | null
          setting_category: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description_arabic?: string | null
          description_english?: string | null
          id?: string
          is_editable?: boolean | null
          is_system_setting?: boolean | null
          setting_category: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description_arabic?: string | null
          description_english?: string | null
          id?: string
          is_editable?: boolean | null
          is_system_setting?: boolean | null
          setting_category?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_integrations: {
        Row: {
          api_credentials: Json | null
          company_id: string | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_sync: string | null
          sync_status: string | null
          tool_category: string
          tool_name: string
          updated_at: string | null
        }
        Insert: {
          api_credentials?: Json | null
          company_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          tool_category: string
          tool_name: string
          updated_at?: string | null
        }
        Update: {
          api_credentials?: Json | null
          company_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          tool_category?: string
          tool_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_integrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_usage_analytics: {
        Row: {
          action_type: string
          company_id: string | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          metadata: Json | null
          success: boolean | null
          tool_name: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          success?: boolean | null
          tool_name: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          success?: boolean | null
          tool_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_usage_analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      training_enrollments: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          attendance_percentage: number | null
          attendance_status: string | null
          certificate_date: string | null
          certificate_issued: boolean | null
          certificate_url: string | null
          created_at: string | null
          employee_id: string
          enrollment_date: string
          enrollment_status: string | null
          final_score: number | null
          id: string
          participant_feedback_comments: string | null
          participant_feedback_rating: number | null
          pass_status: boolean | null
          post_assessment_score: number | null
          pre_assessment_score: number | null
          requires_manager_approval: boolean | null
          trainer_feedback_comments: string | null
          training_session_id: string
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          attendance_percentage?: number | null
          attendance_status?: string | null
          certificate_date?: string | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          created_at?: string | null
          employee_id: string
          enrollment_date: string
          enrollment_status?: string | null
          final_score?: number | null
          id?: string
          participant_feedback_comments?: string | null
          participant_feedback_rating?: number | null
          pass_status?: boolean | null
          post_assessment_score?: number | null
          pre_assessment_score?: number | null
          requires_manager_approval?: boolean | null
          trainer_feedback_comments?: string | null
          training_session_id: string
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          attendance_percentage?: number | null
          attendance_status?: string | null
          certificate_date?: string | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          created_at?: string | null
          employee_id?: string
          enrollment_date?: string
          enrollment_status?: string | null
          final_score?: number | null
          id?: string
          participant_feedback_comments?: string | null
          participant_feedback_rating?: number | null
          pass_status?: boolean | null
          post_assessment_score?: number | null
          pre_assessment_score?: number | null
          requires_manager_approval?: boolean | null
          trainer_feedback_comments?: string | null
          training_session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_enrollments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_training_session_id_fkey"
            columns: ["training_session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          budget_allocated: number | null
          certification_name: string | null
          certification_validity_months: number | null
          company_id: string
          cost_per_participant: number | null
          created_at: string | null
          currency: string | null
          delivery_method: string | null
          description_arabic: string | null
          description_english: string | null
          duration_hours: number | null
          id: string
          location_arabic: string | null
          location_english: string | null
          max_participants: number | null
          objectives_arabic: string | null
          objectives_english: string | null
          prerequisites_arabic: string | null
          prerequisites_english: string | null
          program_code: string | null
          program_name_arabic: string
          program_name_english: string
          provides_certification: boolean | null
          status: string | null
          target_audience: string | null
          trainer_credentials: string | null
          trainer_name: string | null
          training_category: string | null
          training_provider_name: string | null
          training_type: string | null
          updated_at: string | null
        }
        Insert: {
          budget_allocated?: number | null
          certification_name?: string | null
          certification_validity_months?: number | null
          company_id: string
          cost_per_participant?: number | null
          created_at?: string | null
          currency?: string | null
          delivery_method?: string | null
          description_arabic?: string | null
          description_english?: string | null
          duration_hours?: number | null
          id?: string
          location_arabic?: string | null
          location_english?: string | null
          max_participants?: number | null
          objectives_arabic?: string | null
          objectives_english?: string | null
          prerequisites_arabic?: string | null
          prerequisites_english?: string | null
          program_code?: string | null
          program_name_arabic: string
          program_name_english: string
          provides_certification?: boolean | null
          status?: string | null
          target_audience?: string | null
          trainer_credentials?: string | null
          trainer_name?: string | null
          training_category?: string | null
          training_provider_name?: string | null
          training_type?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_allocated?: number | null
          certification_name?: string | null
          certification_validity_months?: number | null
          company_id?: string
          cost_per_participant?: number | null
          created_at?: string | null
          currency?: string | null
          delivery_method?: string | null
          description_arabic?: string | null
          description_english?: string | null
          duration_hours?: number | null
          id?: string
          location_arabic?: string | null
          location_english?: string | null
          max_participants?: number | null
          objectives_arabic?: string | null
          objectives_english?: string | null
          prerequisites_arabic?: string | null
          prerequisites_english?: string | null
          program_code?: string | null
          program_name_arabic?: string
          program_name_english?: string
          provides_certification?: boolean | null
          status?: string | null
          target_audience?: string | null
          trainer_credentials?: string | null
          trainer_name?: string | null
          training_category?: string | null
          training_provider_name?: string | null
          training_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_programs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      training_sessions: {
        Row: {
          created_at: string | null
          current_enrollments: number | null
          end_date: string
          end_time: string | null
          external_instructor_name: string | null
          id: string
          instructor_id: string | null
          materials_url: string | null
          max_participants: number | null
          online_meeting_url: string | null
          room_number: string | null
          session_name_arabic: string | null
          session_name_english: string
          session_notes: string | null
          session_number: number | null
          start_date: string
          start_time: string | null
          status: string | null
          training_program_id: string
          updated_at: string | null
          venue_arabic: string | null
          venue_english: string | null
          waitlist_count: number | null
        }
        Insert: {
          created_at?: string | null
          current_enrollments?: number | null
          end_date: string
          end_time?: string | null
          external_instructor_name?: string | null
          id?: string
          instructor_id?: string | null
          materials_url?: string | null
          max_participants?: number | null
          online_meeting_url?: string | null
          room_number?: string | null
          session_name_arabic?: string | null
          session_name_english: string
          session_notes?: string | null
          session_number?: number | null
          start_date: string
          start_time?: string | null
          status?: string | null
          training_program_id: string
          updated_at?: string | null
          venue_arabic?: string | null
          venue_english?: string | null
          waitlist_count?: number | null
        }
        Update: {
          created_at?: string | null
          current_enrollments?: number | null
          end_date?: string
          end_time?: string | null
          external_instructor_name?: string | null
          id?: string
          instructor_id?: string | null
          materials_url?: string | null
          max_participants?: number | null
          online_meeting_url?: string | null
          room_number?: string | null
          session_name_arabic?: string | null
          session_name_english?: string
          session_notes?: string | null
          session_number?: number | null
          start_date?: string
          start_time?: string | null
          status?: string | null
          training_program_id?: string
          updated_at?: string | null
          venue_arabic?: string | null
          venue_english?: string | null
          waitlist_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_training_program_id_fkey"
            columns: ["training_program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_audits: {
        Row: {
          ai_patched_keys: number | null
          audit_results: Json | null
          audit_status: string
          audit_type: string
          completed_at: string | null
          created_at: string | null
          hardcoded_strings_found: number | null
          id: string
          missing_arabic_keys: number | null
          needs_review_count: number | null
          total_keys_scanned: number | null
        }
        Insert: {
          ai_patched_keys?: number | null
          audit_results?: Json | null
          audit_status?: string
          audit_type: string
          completed_at?: string | null
          created_at?: string | null
          hardcoded_strings_found?: number | null
          id?: string
          missing_arabic_keys?: number | null
          needs_review_count?: number | null
          total_keys_scanned?: number | null
        }
        Update: {
          ai_patched_keys?: number | null
          audit_results?: Json | null
          audit_status?: string
          audit_type?: string
          completed_at?: string | null
          created_at?: string | null
          hardcoded_strings_found?: number | null
          id?: string
          missing_arabic_keys?: number | null
          needs_review_count?: number | null
          total_keys_scanned?: number | null
        }
        Relationships: []
      }
      translation_cache_invalidations: {
        Row: {
          affected_keys: string[] | null
          created_at: string | null
          id: string
          invalidation_reason: string
          triggered_by: string | null
        }
        Insert: {
          affected_keys?: string[] | null
          created_at?: string | null
          id?: string
          invalidation_reason: string
          triggered_by?: string | null
        }
        Update: {
          affected_keys?: string[] | null
          created_at?: string | null
          id?: string
          invalidation_reason?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      translation_feedback: {
        Row: {
          company_id: string | null
          context_url: string
          created_at: string
          feedback_type: string | null
          id: string
          implemented_at: string | null
          language_code: string | null
          metadata: Json | null
          original_text: string
          page_title: string | null
          priority_level: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          screenshot_url: string | null
          status: string | null
          suggested_text: string
          translation_key: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          context_url: string
          created_at?: string
          feedback_type?: string | null
          id?: string
          implemented_at?: string | null
          language_code?: string | null
          metadata?: Json | null
          original_text: string
          page_title?: string | null
          priority_level?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          screenshot_url?: string | null
          status?: string | null
          suggested_text: string
          translation_key: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          context_url?: string
          created_at?: string
          feedback_type?: string | null
          id?: string
          implemented_at?: string | null
          language_code?: string | null
          metadata?: Json | null
          original_text?: string
          page_title?: string | null
          priority_level?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          screenshot_url?: string | null
          status?: string | null
          suggested_text?: string
          translation_key?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      translation_patches: {
        Row: {
          applied_at: string | null
          approval_status: string | null
          approved_by: string | null
          confidence_score: number | null
          id: string
          language: string
          patch_source: string | null
          patched_text: string
          translation_key: string
        }
        Insert: {
          applied_at?: string | null
          approval_status?: string | null
          approved_by?: string | null
          confidence_score?: number | null
          id?: string
          language: string
          patch_source?: string | null
          patched_text: string
          translation_key: string
        }
        Update: {
          applied_at?: string | null
          approval_status?: string | null
          approved_by?: string | null
          confidence_score?: number | null
          id?: string
          language?: string
          patch_source?: string | null
          patched_text?: string
          translation_key?: string
        }
        Relationships: []
      }
      translation_registry: {
        Row: {
          arabic_text: string | null
          context_info: string | null
          created_at: string | null
          english_text: string | null
          id: string
          is_ai_generated: boolean | null
          last_updated_ar: string | null
          last_updated_en: string | null
          needs_review: boolean | null
          source_file: string
          source_line: number | null
          translation_key: string
          updated_at: string | null
        }
        Insert: {
          arabic_text?: string | null
          context_info?: string | null
          created_at?: string | null
          english_text?: string | null
          id?: string
          is_ai_generated?: boolean | null
          last_updated_ar?: string | null
          last_updated_en?: string | null
          needs_review?: boolean | null
          source_file: string
          source_line?: number | null
          translation_key: string
          updated_at?: string | null
        }
        Update: {
          arabic_text?: string | null
          context_info?: string | null
          created_at?: string | null
          english_text?: string | null
          id?: string
          is_ai_generated?: boolean | null
          last_updated_ar?: string | null
          last_updated_en?: string | null
          needs_review?: boolean | null
          source_file?: string
          source_line?: number | null
          translation_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          bucket_name: string
          company_id: string | null
          created_at: string | null
          error_message: string | null
          extracted_data: Json | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          integration_type: string | null
          module_type: string | null
          processing_status: string | null
          status: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket_name: string
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          integration_type?: string | null
          module_type?: string | null
          processing_status?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket_name?: string
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          integration_type?: string | null
          module_type?: string | null
          processing_status?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          company_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedules: {
        Row: {
          break_duration_minutes: number | null
          company_id: string
          core_hours_end: string | null
          core_hours_start: string | null
          created_at: string | null
          flexible_hours: boolean | null
          friday_end_time: string | null
          friday_start_time: string | null
          id: string
          monday_end_time: string | null
          monday_start_time: string | null
          prayer_break_minutes: number | null
          saturday_end_time: string | null
          saturday_start_time: string | null
          schedule_code: string | null
          schedule_name_arabic: string
          schedule_name_english: string
          status: string | null
          sunday_end_time: string | null
          sunday_start_time: string | null
          thursday_end_time: string | null
          thursday_start_time: string | null
          total_hours_per_week: number | null
          tuesday_end_time: string | null
          tuesday_start_time: string | null
          updated_at: string | null
          wednesday_end_time: string | null
          wednesday_start_time: string | null
          working_days_per_week: number | null
        }
        Insert: {
          break_duration_minutes?: number | null
          company_id: string
          core_hours_end?: string | null
          core_hours_start?: string | null
          created_at?: string | null
          flexible_hours?: boolean | null
          friday_end_time?: string | null
          friday_start_time?: string | null
          id?: string
          monday_end_time?: string | null
          monday_start_time?: string | null
          prayer_break_minutes?: number | null
          saturday_end_time?: string | null
          saturday_start_time?: string | null
          schedule_code?: string | null
          schedule_name_arabic: string
          schedule_name_english: string
          status?: string | null
          sunday_end_time?: string | null
          sunday_start_time?: string | null
          thursday_end_time?: string | null
          thursday_start_time?: string | null
          total_hours_per_week?: number | null
          tuesday_end_time?: string | null
          tuesday_start_time?: string | null
          updated_at?: string | null
          wednesday_end_time?: string | null
          wednesday_start_time?: string | null
          working_days_per_week?: number | null
        }
        Update: {
          break_duration_minutes?: number | null
          company_id?: string
          core_hours_end?: string | null
          core_hours_start?: string | null
          created_at?: string | null
          flexible_hours?: boolean | null
          friday_end_time?: string | null
          friday_start_time?: string | null
          id?: string
          monday_end_time?: string | null
          monday_start_time?: string | null
          prayer_break_minutes?: number | null
          saturday_end_time?: string | null
          saturday_start_time?: string | null
          schedule_code?: string | null
          schedule_name_arabic?: string
          schedule_name_english?: string
          status?: string | null
          sunday_end_time?: string | null
          sunday_start_time?: string | null
          thursday_end_time?: string | null
          thursday_start_time?: string | null
          total_hours_per_week?: number | null
          tuesday_end_time?: string | null
          tuesday_start_time?: string | null
          updated_at?: string | null
          wednesday_end_time?: string | null
          wednesday_start_time?: string | null
          working_days_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      working_hours_config: {
        Row: {
          break_duration: number | null
          company_id: string | null
          created_at: string | null
          grace_period_minutes: number | null
          id: string
          max_overtime_yearly: number | null
          overtime_rate: number | null
          overtime_threshold_daily: number | null
          overtime_threshold_weekly: number | null
          ramadan_daily_hours: number | null
          ramadan_weekly_hours: number | null
          standard_daily_hours: number | null
          standard_weekly_hours: number | null
          updated_at: string | null
          work_week_end: string | null
          work_week_start: string | null
        }
        Insert: {
          break_duration?: number | null
          company_id?: string | null
          created_at?: string | null
          grace_period_minutes?: number | null
          id?: string
          max_overtime_yearly?: number | null
          overtime_rate?: number | null
          overtime_threshold_daily?: number | null
          overtime_threshold_weekly?: number | null
          ramadan_daily_hours?: number | null
          ramadan_weekly_hours?: number | null
          standard_daily_hours?: number | null
          standard_weekly_hours?: number | null
          updated_at?: string | null
          work_week_end?: string | null
          work_week_start?: string | null
        }
        Update: {
          break_duration?: number | null
          company_id?: string | null
          created_at?: string | null
          grace_period_minutes?: number | null
          id?: string
          max_overtime_yearly?: number | null
          overtime_rate?: number | null
          overtime_threshold_daily?: number | null
          overtime_threshold_weekly?: number | null
          ramadan_daily_hours?: number | null
          ramadan_weekly_hours?: number | null
          standard_daily_hours?: number | null
          standard_weekly_hours?: number | null
          updated_at?: string | null
          work_week_end?: string | null
          work_week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "working_hours_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      workplace_transfers: {
        Row: {
          approved_by: string | null
          company_id: string | null
          created_at: string | null
          effective_date: string | null
          employee_id: string | null
          from_department: string | null
          from_location: string
          hr_approved_by: string | null
          id: string
          reason: string | null
          requested_by: string | null
          status: string | null
          to_department: string | null
          to_location: string
          transfer_date: string
          transfer_type: string | null
        }
        Insert: {
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          effective_date?: string | null
          employee_id?: string | null
          from_department?: string | null
          from_location: string
          hr_approved_by?: string | null
          id?: string
          reason?: string | null
          requested_by?: string | null
          status?: string | null
          to_department?: string | null
          to_location: string
          transfer_date: string
          transfer_type?: string | null
        }
        Update: {
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          effective_date?: string | null
          employee_id?: string | null
          from_department?: string | null
          from_location?: string
          hr_approved_by?: string | null
          id?: string
          reason?: string | null
          requested_by?: string | null
          status?: string | null
          to_department?: string | null
          to_location?: string
          transfer_date?: string
          transfer_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workplace_transfers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_requested_by_fkey"
            columns: ["requested_by"]
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
      apply_translation_patch: {
        Args: {
          p_key: string
          p_language: string
          p_text: string
          p_confidence?: number
        }
        Returns: string
      }
      audit_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          policy_count: number
          rls_enabled: boolean
        }[]
      }
      auto_classify_employee_gosi: {
        Args: { p_employee_id: string }
        Returns: undefined
      }
      calculate_annual_leave_entitlement: {
        Args: { p_hire_date: string; p_current_date?: string }
        Returns: number
      }
      calculate_gosi_rates: {
        Args: { p_employee_id: string; p_as_of_date?: string }
        Returns: {
          employee_rate: number
          employer_rate: number
          system_type: string
        }[]
      }
      calculate_overtime_amount: {
        Args: {
          p_basic_salary: number
          p_overtime_hours: number
          p_standard_hours?: number
        }
        Returns: number
      }
      calculate_working_hours: {
        Args: {
          p_check_in: string
          p_check_out: string
          p_break_duration?: number
        }
        Returns: number
      }
      cleanup_old_compliance_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cosine_similarity: {
        Args: { a: number[]; b: number[] }
        Returns: number
      }
      find_similar_chunks: {
        Args: {
          query_embedding: number[]
          similarity_threshold?: number
          max_results?: number
          target_company_id?: string
          target_module_key?: string
        }
        Returns: {
          chunk_id: string
          document_id: string
          content: string
          similarity_score: number
          file_name: string
          module_key: string
          chunk_index: number
        }[]
      }
      generate_comprehensive_employee_report: {
        Args: { _company_id?: string; _filters?: Json; _report_name?: string }
        Returns: string
      }
      get_activities_by_sector: {
        Args: { sector_code: string }
        Returns: {
          id: string
          classification_code: string
          name_en: string
          name_ar: string
        }[]
      }
      get_cities_by_region: {
        Args: { region_code: string }
        Returns: {
          id: string
          code: string
          name_en: string
          name_ar: string
          timezone: string
        }[]
      }
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_pilot_user: {
        Args: { user_uuid: string; feature_name?: string }
        Returns: boolean
      }
      register_discovered_module: {
        Args: {
          p_module_name: string
          p_module_path: string
          p_module_category: string
          p_metadata?: Json
        }
        Returns: string
      }
      register_translation_key: {
        Args: {
          p_key: string
          p_source_file: string
          p_source_line?: number
          p_context?: string
          p_english_text?: string
          p_arabic_text?: string
        }
        Returns: string
      }
      sync_tool_integration: {
        Args: { p_company_id: string; p_tool_name: string; p_action?: string }
        Returns: undefined
      }
      validate_user_isolation: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          company_id: string
          has_access: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "hr_manager" | "employee" | "viewer"
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
      app_role: ["admin", "hr_manager", "employee", "viewer"],
    },
  },
} as const
