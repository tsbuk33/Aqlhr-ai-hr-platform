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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_classify_employee_gosi: {
        Args: { p_employee_id: string }
        Returns: undefined
      }
      calculate_gosi_rates: {
        Args: { p_employee_id: string; p_as_of_date?: string }
        Returns: {
          employee_rate: number
          employer_rate: number
          system_type: string
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
    Enums: {},
  },
} as const
