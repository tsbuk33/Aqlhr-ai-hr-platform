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
      employees: {
        Row: {
          actual_job_title: string | null
          actual_job_title_ar: string | null
          additional_attributes: Json | null
          agreed_annual_bonus: number | null
          annual_tickets_count: number | null
          annual_tickets_type: string | null
          basic_salary: number | null
          certificates: string | null
          certificates_ar: string | null
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
          family_status: string | null
          first_name: string
          first_name_ar: string | null
          gender: string | null
          gosi_cost_per_month: number | null
          grade_level: string | null
          hire_date: string | null
          hired_request_number: string | null
          housing_allowance_percentage: number | null
          iban_number: string | null
          id: string
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
          national_address: string | null
          national_id: string | null
          nationality: string | null
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
          project_cost_number: string | null
          project_hired_for: string | null
          project_hired_for_ar: string | null
          project_name: string | null
          project_name_ar: string | null
          project_number: string | null
          qiwa_contract: boolean | null
          recruitment_type: string | null
          salary: number | null
          salary_level: string | null
          saudi_engineer_card_number: string | null
          schooling_fees_coverage: string | null
          shift_type: string | null
          status: string | null
          transportation_allowance_percentage: number | null
          updated_at: string | null
          vacation_days_per_year: number | null
          visa_number: string | null
          work_location: string | null
          work_location_ar: string | null
        }
        Insert: {
          actual_job_title?: string | null
          actual_job_title_ar?: string | null
          additional_attributes?: Json | null
          agreed_annual_bonus?: number | null
          annual_tickets_count?: number | null
          annual_tickets_type?: string | null
          basic_salary?: number | null
          certificates?: string | null
          certificates_ar?: string | null
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
          family_status?: string | null
          first_name: string
          first_name_ar?: string | null
          gender?: string | null
          gosi_cost_per_month?: number | null
          grade_level?: string | null
          hire_date?: string | null
          hired_request_number?: string | null
          housing_allowance_percentage?: number | null
          iban_number?: string | null
          id?: string
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
          national_address?: string | null
          national_id?: string | null
          nationality?: string | null
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
          project_cost_number?: string | null
          project_hired_for?: string | null
          project_hired_for_ar?: string | null
          project_name?: string | null
          project_name_ar?: string | null
          project_number?: string | null
          qiwa_contract?: boolean | null
          recruitment_type?: string | null
          salary?: number | null
          salary_level?: string | null
          saudi_engineer_card_number?: string | null
          schooling_fees_coverage?: string | null
          shift_type?: string | null
          status?: string | null
          transportation_allowance_percentage?: number | null
          updated_at?: string | null
          vacation_days_per_year?: number | null
          visa_number?: string | null
          work_location?: string | null
          work_location_ar?: string | null
        }
        Update: {
          actual_job_title?: string | null
          actual_job_title_ar?: string | null
          additional_attributes?: Json | null
          agreed_annual_bonus?: number | null
          annual_tickets_count?: number | null
          annual_tickets_type?: string | null
          basic_salary?: number | null
          certificates?: string | null
          certificates_ar?: string | null
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
          family_status?: string | null
          first_name?: string
          first_name_ar?: string | null
          gender?: string | null
          gosi_cost_per_month?: number | null
          grade_level?: string | null
          hire_date?: string | null
          hired_request_number?: string | null
          housing_allowance_percentage?: number | null
          iban_number?: string | null
          id?: string
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
          national_address?: string | null
          national_id?: string | null
          nationality?: string | null
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
          project_cost_number?: string | null
          project_hired_for?: string | null
          project_hired_for_ar?: string | null
          project_name?: string | null
          project_name_ar?: string | null
          project_number?: string | null
          qiwa_contract?: boolean | null
          recruitment_type?: string | null
          salary?: number | null
          salary_level?: string | null
          saudi_engineer_card_number?: string | null
          schooling_fees_coverage?: string | null
          shift_type?: string | null
          status?: string | null
          transportation_allowance_percentage?: number | null
          updated_at?: string | null
          vacation_days_per_year?: number | null
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
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
