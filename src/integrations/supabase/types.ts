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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advanced_payroll_items: {
        Row: {
          basic_salary: number
          calculation_details: Json | null
          created_at: string
          employee_id: string
          gosi_employee: number
          gosi_employer: number
          gross_pay: number
          id: string
          loan_deductions: number
          net_pay: number
          other_deductions: number
          overtime_amount: number
          overtime_hours: number
          payroll_run_id: string
          ramadan_adjustment: number
          total_allowances: number
          total_deductions: number
          working_days: number
          working_hours: number
        }
        Insert: {
          basic_salary?: number
          calculation_details?: Json | null
          created_at?: string
          employee_id: string
          gosi_employee?: number
          gosi_employer?: number
          gross_pay?: number
          id?: string
          loan_deductions?: number
          net_pay?: number
          other_deductions?: number
          overtime_amount?: number
          overtime_hours?: number
          payroll_run_id: string
          ramadan_adjustment?: number
          total_allowances?: number
          total_deductions?: number
          working_days?: number
          working_hours?: number
        }
        Update: {
          basic_salary?: number
          calculation_details?: Json | null
          created_at?: string
          employee_id?: string
          gosi_employee?: number
          gosi_employer?: number
          gross_pay?: number
          id?: string
          loan_deductions?: number
          net_pay?: number
          other_deductions?: number
          overtime_amount?: number
          overtime_hours?: number
          payroll_run_id?: string
          ramadan_adjustment?: number
          total_allowances?: number
          total_deductions?: number
          working_days?: number
          working_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "advanced_payroll_items_payroll_run_id_fkey"
            columns: ["payroll_run_id"]
            isOneToOne: false
            referencedRelation: "advanced_payroll_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_payroll_runs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          calculation_logs: Json | null
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          is_ramadan_period: boolean
          pay_date: string
          pay_period_end: string
          pay_period_start: string
          run_name: string
          status: string
          total_deductions: number
          total_employees: number
          total_gross_pay: number
          total_net_pay: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          calculation_logs?: Json | null
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_ramadan_period?: boolean
          pay_date: string
          pay_period_end: string
          pay_period_start: string
          run_name: string
          status?: string
          total_deductions?: number
          total_employees?: number
          total_gross_pay?: number
          total_net_pay?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          calculation_logs?: Json | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_ramadan_period?: boolean
          pay_date?: string
          pay_period_end?: string
          pay_period_start?: string
          run_name?: string
          status?: string
          total_deductions?: number
          total_employees?: number
          total_gross_pay?: number
          total_net_pay?: number
        }
        Relationships: []
      }
      agent_actions: {
        Row: {
          action_type: string | null
          created_at: string | null
          created_by: string | null
          error: string | null
          finished_at: string | null
          id: string
          payload: Json | null
          started_at: string | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          payload?: Json | null
          started_at?: string | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          action_type?: string | null
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          payload?: Json | null
          started_at?: string | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: []
      }
      agent_skill_bindings: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          last_run_at: string | null
          last_run_metrics: Json | null
          last_run_status: string | null
          next_run_at: string | null
          run_count: number
          skill_code: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          last_run_metrics?: Json | null
          last_run_status?: string | null
          next_run_at?: string | null
          run_count?: number
          skill_code: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          last_run_metrics?: Json | null
          last_run_status?: string | null
          next_run_at?: string | null
          run_count?: number
          skill_code?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_skill_bindings_skill_code_fkey"
            columns: ["skill_code"]
            isOneToOne: false
            referencedRelation: "agent_skills"
            referencedColumns: ["code"]
          },
        ]
      }
      agent_skill_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          dry_run: boolean
          error_message: string | null
          execution_id: string
          id: string
          input_data: Json | null
          metrics: Json | null
          output_data: Json | null
          skill_code: string
          started_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          dry_run?: boolean
          error_message?: string | null
          execution_id: string
          id?: string
          input_data?: Json | null
          metrics?: Json | null
          output_data?: Json | null
          skill_code: string
          started_at?: string
          status?: string
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          dry_run?: boolean
          error_message?: string | null
          execution_id?: string
          id?: string
          input_data?: Json | null
          metrics?: Json | null
          output_data?: Json | null
          skill_code?: string
          started_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: []
      }
      agent_skills: {
        Row: {
          category: string
          code: string
          created_at: string
          default_config: Json | null
          description: string | null
          enabled: boolean
          execution_type: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          code: string
          created_at?: string
          default_config?: Json | null
          description?: string | null
          enabled?: boolean
          execution_type?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          default_config?: Json | null
          description?: string | null
          enabled?: boolean
          execution_type?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_tool_usage: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          input: Json | null
          output: Json | null
          success: boolean | null
          tenant_id: string
          tool_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: string
          input?: Json | null
          output?: Json | null
          success?: boolean | null
          tenant_id: string
          tool_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          input?: Json | null
          output?: Json | null
          success?: boolean | null
          tenant_id?: string
          tool_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_tool_usage_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tool_usage_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "agent_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tools: {
        Row: {
          auth_type: string | null
          code: string
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          input_schema: Json | null
          output_schema: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          auth_type?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          input_schema?: Json | null
          output_schema?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          auth_type?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          input_schema?: Json | null
          output_schema?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
          business_impact: string | null
          category: string
          company_id: string | null
          compliance_level: string | null
          content_ar: string | null
          content_en: string
          created_at: string | null
          government_agency: string | null
          government_source: string | null
          helpful_votes: number | null
          id: string
          implementation_difficulty: string | null
          is_active: boolean | null
          keywords_ar: string[] | null
          keywords_en: string[] | null
          last_reviewed_at: string | null
          law_article: string | null
          module_name: string | null
          regulation_reference: string | null
          review_required: boolean | null
          reviewed_by: string | null
          saudi_law_category: string | null
          search_count: number | null
          subcategory: string | null
          title_ar: string | null
          title_en: string
          unhelpful_votes: number | null
          updated_at: string | null
        }
        Insert: {
          business_impact?: string | null
          category: string
          company_id?: string | null
          compliance_level?: string | null
          content_ar?: string | null
          content_en: string
          created_at?: string | null
          government_agency?: string | null
          government_source?: string | null
          helpful_votes?: number | null
          id?: string
          implementation_difficulty?: string | null
          is_active?: boolean | null
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_reviewed_at?: string | null
          law_article?: string | null
          module_name?: string | null
          regulation_reference?: string | null
          review_required?: boolean | null
          reviewed_by?: string | null
          saudi_law_category?: string | null
          search_count?: number | null
          subcategory?: string | null
          title_ar?: string | null
          title_en: string
          unhelpful_votes?: number | null
          updated_at?: string | null
        }
        Update: {
          business_impact?: string | null
          category?: string
          company_id?: string | null
          compliance_level?: string | null
          content_ar?: string | null
          content_en?: string
          created_at?: string | null
          government_agency?: string | null
          government_source?: string | null
          helpful_votes?: number | null
          id?: string
          implementation_difficulty?: string | null
          is_active?: boolean | null
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_reviewed_at?: string | null
          law_article?: string | null
          module_name?: string | null
          regulation_reference?: string | null
          review_required?: boolean | null
          reviewed_by?: string | null
          saudi_law_category?: string | null
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
          {
            foreignKeyName: "ai_predictions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_predictions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "ai_recommendations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      allowance_definitions: {
        Row: {
          affects_eos: boolean
          affects_gosi: boolean
          allowance_code: string
          allowance_name_ar: string
          allowance_name_en: string
          calculation_formula: Json
          calculation_type: string
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          is_taxable: boolean
        }
        Insert: {
          affects_eos?: boolean
          affects_gosi?: boolean
          allowance_code: string
          allowance_name_ar: string
          allowance_name_en: string
          calculation_formula?: Json
          calculation_type: string
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_taxable?: boolean
        }
        Update: {
          affects_eos?: boolean
          affects_gosi?: boolean
          allowance_code?: string
          allowance_name_ar?: string
          allowance_name_en?: string
          calculation_formula?: Json
          calculation_type?: string
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_taxable?: boolean
        }
        Relationships: []
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
      api_audit_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_body: Json | null
          request_headers: Json | null
          response_status: number | null
          response_time_ms: number | null
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method: string
          request_body?: Json | null
          request_headers?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_body?: Json | null
          request_headers?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          active: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          key_hash: string
          last_used_at: string | null
          name: string
          scopes: string[] | null
          tenant_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          last_used_at?: string | null
          name: string
          scopes?: string[] | null
          tenant_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limit: {
        Row: {
          bucket: string
          counter: number | null
          created_at: string | null
          id: string
          tenant_id: string
          window_start: string
        }
        Insert: {
          bucket: string
          counter?: number | null
          created_at?: string | null
          id?: string
          tenant_id: string
          window_start: string
        }
        Update: {
          bucket?: string
          counter?: number | null
          created_at?: string | null
          id?: string
          tenant_id?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limit_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          api_key_id: string | null
          call_count: number
          created_at: string
          id: string
          tenant_id: string
          updated_at: string
          window_start: string
        }
        Insert: {
          api_key_id?: string | null
          call_count?: number
          created_at?: string
          id?: string
          tenant_id: string
          updated_at?: string
          window_start: string
        }
        Update: {
          api_key_id?: string | null
          call_count?: number
          created_at?: string
          id?: string
          tenant_id?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      api_scopes: {
        Row: {
          created_at: string
          id: string
          scope_description: string | null
          scope_key: string
          scope_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          scope_description?: string | null
          scope_key: string
          scope_name: string
        }
        Update: {
          created_at?: string
          id?: string
          scope_description?: string | null
          scope_key?: string
          scope_name?: string
        }
        Relationships: []
      }
      assistant_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string
          tenant_id: string
          tool_name: string | null
          tool_payload: Json | null
          tool_result: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id: string
          tenant_id: string
          tool_name?: string | null
          tool_payload?: Json | null
          tool_result?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string
          tenant_id?: string
          tool_name?: string | null
          tool_payload?: Json | null
          tool_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assistant_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assistant_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_sessions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          lang: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lang?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lang?: string | null
          tenant_id?: string
        }
        Relationships: []
      }
      assistant_tool_logs: {
        Row: {
          called_at: string | null
          id: string
          payload: Json | null
          requested_by: string | null
          result_summary: string | null
          tenant_id: string
          tool_name: string
        }
        Insert: {
          called_at?: string | null
          id?: string
          payload?: Json | null
          requested_by?: string | null
          result_summary?: string | null
          tenant_id: string
          tool_name: string
        }
        Update: {
          called_at?: string | null
          id?: string
          payload?: Json | null
          requested_by?: string | null
          result_summary?: string | null
          tenant_id?: string
          tool_name?: string
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
            foreignKeyName: "attendance_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "attendance_analytics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_analytics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "attendance_deductions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_deductions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "attendance_deductions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_deductions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "attendance_timesheet_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_timesheet_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity: string | null
          entity_id: string | null
          id: string
          ip_address: unknown | null
          tenant_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip_address?: unknown | null
          tenant_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip_address?: unknown | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          category: string | null
          company_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          severity: string | null
          table_name: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          severity?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          severity?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
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
      auth_email_events: {
        Row: {
          created_at: string
          email: string
          error_message: string | null
          id: string
          ip_address: unknown | null
          mode: string
          sent_at: string
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          mode: string
          sent_at?: string
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          mode?: string
          sent_at?: string
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      auth_security_config: {
        Row: {
          compliant: boolean
          config_name: string
          config_value: string
          description: string
          id: string
          last_updated: string
          recommended_value: string
          severity: string
          updated_by: string | null
        }
        Insert: {
          compliant?: boolean
          config_name: string
          config_value: string
          description: string
          id?: string
          last_updated?: string
          recommended_value: string
          severity: string
          updated_by?: string | null
        }
        Update: {
          compliant?: boolean
          config_name?: string
          config_value?: string
          description?: string
          id?: string
          last_updated?: string
          recommended_value?: string
          severity?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      automation_metrics: {
        Row: {
          action: string
          automation_score: number
          autonomy_level: number
          command_type: string
          complexity: string
          created_at: string
          execution_time: string
          id: string
          metadata: Json | null
          module: string | null
          success: boolean
          tasks_completed: string[]
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          automation_score?: number
          autonomy_level?: number
          command_type: string
          complexity?: string
          created_at?: string
          execution_time?: string
          id?: string
          metadata?: Json | null
          module?: string | null
          success?: boolean
          tasks_completed?: string[]
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          automation_score?: number
          autonomy_level?: number
          command_type?: string
          complexity?: string
          created_at?: string
          execution_time?: string
          id?: string
          metadata?: Json | null
          module?: string | null
          success?: boolean
          tasks_completed?: string[]
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: []
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
      cci_benchmarks: {
        Row: {
          country: string
          industry: string
          metric: string
          p50: number | null
          p75: number | null
          p90: number | null
        }
        Insert: {
          country: string
          industry: string
          metric: string
          p50?: number | null
          p75?: number | null
          p90?: number | null
        }
        Update: {
          country?: string
          industry?: string
          metric?: string
          p50?: number | null
          p75?: number | null
          p90?: number | null
        }
        Relationships: []
      }
      cci_evidence: {
        Row: {
          ai_confidence: number | null
          ai_tags: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          extracted_text: string | null
          file_metadata: Json | null
          id: string
          processed_at: string | null
          processing_status: string | null
          storage_path: string | null
          survey_id: string | null
          tags: string[] | null
          tenant_id: string
          title: string | null
          type: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          ai_confidence?: number | null
          ai_tags?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          extracted_text?: string | null
          file_metadata?: Json | null
          id?: string
          processed_at?: string | null
          processing_status?: string | null
          storage_path?: string | null
          survey_id?: string | null
          tags?: string[] | null
          tenant_id: string
          title?: string | null
          type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          ai_confidence?: number | null
          ai_tags?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          extracted_text?: string | null
          file_metadata?: Json | null
          id?: string
          processed_at?: string | null
          processing_status?: string | null
          storage_path?: string | null
          survey_id?: string | null
          tags?: string[] | null
          tenant_id?: string
          title?: string | null
          type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_evidence_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_evidence_vectors: {
        Row: {
          embedding: string | null
          evidence_id: string
        }
        Insert: {
          embedding?: string | null
          evidence_id: string
        }
        Update: {
          embedding?: string | null
          evidence_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cci_evidence_vectors_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: true
            referencedRelation: "cci_evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_invite_tokens: {
        Row: {
          channel: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          meta: Json | null
          redeemed_at: string | null
          survey_id: string
          tenant_id: string
          token_hash: string
          wave_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          meta?: Json | null
          redeemed_at?: string | null
          survey_id: string
          tenant_id: string
          token_hash: string
          wave_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          meta?: Json | null
          redeemed_at?: string | null
          survey_id?: string
          tenant_id?: string
          token_hash?: string
          wave_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cci_invite_tokens_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cci_invite_tokens_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_response_quality_v1"
            referencedColumns: ["wave_id"]
          },
          {
            foreignKeyName: "cci_invite_tokens_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_playbooks: {
        Row: {
          ai_summary: string | null
          comms_ar: string | null
          comms_en: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          initiatives: Json | null
          manager_brief: string | null
          owner_id: string | null
          schedule: Json | null
          status: string | null
          survey_id: string | null
          tenant_id: string
          title: string | null
          top_risks: Json | null
          updated_at: string | null
          wave_id: string | null
        }
        Insert: {
          ai_summary?: string | null
          comms_ar?: string | null
          comms_en?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          initiatives?: Json | null
          manager_brief?: string | null
          owner_id?: string | null
          schedule?: Json | null
          status?: string | null
          survey_id?: string | null
          tenant_id: string
          title?: string | null
          top_risks?: Json | null
          updated_at?: string | null
          wave_id?: string | null
        }
        Update: {
          ai_summary?: string | null
          comms_ar?: string | null
          comms_en?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          initiatives?: Json | null
          manager_brief?: string | null
          owner_id?: string | null
          schedule?: Json | null
          status?: string | null
          survey_id?: string | null
          tenant_id?: string
          title?: string | null
          top_risks?: Json | null
          updated_at?: string | null
          wave_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_playbooks_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_responses: {
        Row: {
          answers: Json
          created_at: string | null
          created_by: string | null
          department_id: string | null
          duration_seconds: number | null
          flag_reason: string | null
          gender: string | null
          grade_id: string | null
          id: string
          is_flagged: boolean | null
          nationality: string | null
          project_id: string | null
          respondent_hash: string
          submitted_at: string | null
          survey_id: string
          tenant_id: string
          wave_id: string | null
        }
        Insert: {
          answers: Json
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          duration_seconds?: number | null
          flag_reason?: string | null
          gender?: string | null
          grade_id?: string | null
          id?: string
          is_flagged?: boolean | null
          nationality?: string | null
          project_id?: string | null
          respondent_hash: string
          submitted_at?: string | null
          survey_id: string
          tenant_id: string
          wave_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          duration_seconds?: number | null
          flag_reason?: string | null
          gender?: string | null
          grade_id?: string | null
          id?: string
          is_flagged?: boolean | null
          nationality?: string | null
          project_id?: string | null
          respondent_hash?: string
          submitted_at?: string | null
          survey_id?: string
          tenant_id?: string
          wave_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cci_responses_wave_fk"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_response_quality_v1"
            referencedColumns: ["wave_id"]
          },
          {
            foreignKeyName: "cci_responses_wave_fk"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_scores: {
        Row: {
          balance_score: number | null
          barrett: Json | null
          created_at: string | null
          created_by: string | null
          cvf: Json | null
          evidence_factor: number | null
          id: string
          last_computed_at: string | null
          n: number
          psych_safety: number | null
          risk_index: number | null
          scope: string | null
          scope_id: string | null
          survey_id: string
          tenant_id: string
          values_tags: string[] | null
          wave_id: string | null
          web: Json | null
        }
        Insert: {
          balance_score?: number | null
          barrett?: Json | null
          created_at?: string | null
          created_by?: string | null
          cvf?: Json | null
          evidence_factor?: number | null
          id?: string
          last_computed_at?: string | null
          n: number
          psych_safety?: number | null
          risk_index?: number | null
          scope?: string | null
          scope_id?: string | null
          survey_id: string
          tenant_id: string
          values_tags?: string[] | null
          wave_id?: string | null
          web?: Json | null
        }
        Update: {
          balance_score?: number | null
          barrett?: Json | null
          created_at?: string | null
          created_by?: string | null
          cvf?: Json | null
          evidence_factor?: number | null
          id?: string
          last_computed_at?: string | null
          n?: number
          psych_safety?: number | null
          risk_index?: number | null
          scope?: string | null
          scope_id?: string | null
          survey_id?: string
          tenant_id?: string
          values_tags?: string[] | null
          wave_id?: string | null
          web?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_scores_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cci_scores_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_response_quality_v1"
            referencedColumns: ["wave_id"]
          },
          {
            foreignKeyName: "cci_scores_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_survey_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          dimension: string | null
          framework: string | null
          id: string
          order_no: number | null
          reverse_scored: boolean | null
          scale_max: number | null
          scale_min: number | null
          survey_id: string
          tenant_id: string
          text_ar: string
          text_en: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dimension?: string | null
          framework?: string | null
          id?: string
          order_no?: number | null
          reverse_scored?: boolean | null
          scale_max?: number | null
          scale_min?: number | null
          survey_id: string
          tenant_id: string
          text_ar: string
          text_en: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dimension?: string | null
          framework?: string | null
          id?: string
          order_no?: number | null
          reverse_scored?: boolean | null
          scale_max?: number | null
          scale_min?: number | null
          survey_id?: string
          tenant_id?: string
          text_ar?: string
          text_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "cci_survey_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_surveys: {
        Row: {
          anonymity_min_n: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          language: string | null
          name: string
          status: string | null
          tenant_id: string
          wave_count: number | null
        }
        Insert: {
          anonymity_min_n?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          language?: string | null
          name: string
          status?: string | null
          tenant_id: string
          wave_count?: number | null
        }
        Update: {
          anonymity_min_n?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          language?: string | null
          name?: string
          status?: string | null
          tenant_id?: string
          wave_count?: number | null
        }
        Relationships: []
      }
      cci_waves: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_baseline: boolean | null
          period_end: string | null
          period_start: string | null
          survey_id: string
          tenant_id: string
          wave_no: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_baseline?: boolean | null
          period_end?: string | null
          period_start?: string | null
          survey_id: string
          tenant_id: string
          wave_no: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_baseline?: boolean | null
          period_end?: string | null
          period_start?: string | null
          survey_id?: string
          tenant_id?: string
          wave_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "cci_waves_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
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
          default_locale: string | null
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
          default_locale?: string | null
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
          default_locale?: string | null
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
      company_gov_connections: {
        Row: {
          auto_sync_enabled: boolean | null
          company_id: string
          configuration: Json | null
          connection_status: string | null
          created_at: string | null
          credentials_configured: boolean | null
          id: string
          last_error: string | null
          last_sync_at: string | null
          portal_code: string
          sync_frequency: string | null
          updated_at: string | null
        }
        Insert: {
          auto_sync_enabled?: boolean | null
          company_id: string
          configuration?: Json | null
          connection_status?: string | null
          created_at?: string | null
          credentials_configured?: boolean | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          portal_code: string
          sync_frequency?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_sync_enabled?: boolean | null
          company_id?: string
          configuration?: Json | null
          connection_status?: string | null
          created_at?: string | null
          credentials_configured?: boolean | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          portal_code?: string
          sync_frequency?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_gov_connections_portal_code_fkey"
            columns: ["portal_code"]
            isOneToOne: false
            referencedRelation: "government_portals"
            referencedColumns: ["portal_code"]
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
      company_onboarding_profiles: {
        Row: {
          assessment_completed: boolean | null
          company_id: string
          company_size: string
          completion_date: string | null
          compliance_concerns: string[] | null
          created_at: string | null
          existing_hr_tools: string[] | null
          hr_challenges: string[] | null
          id: string
          industry_type: string
          leave_management_complexity: string | null
          onboarding_completed: boolean | null
          pain_points_ranking: Json | null
          performance_review_frequency: string | null
          priority_areas: string[] | null
          profile_completed: boolean | null
          recommended_modules: string[] | null
          recruitment_process: Json | null
          saudization_percentage_goal: number | null
          setup_duration_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          assessment_completed?: boolean | null
          company_id: string
          company_size: string
          completion_date?: string | null
          compliance_concerns?: string[] | null
          created_at?: string | null
          existing_hr_tools?: string[] | null
          hr_challenges?: string[] | null
          id?: string
          industry_type: string
          leave_management_complexity?: string | null
          onboarding_completed?: boolean | null
          pain_points_ranking?: Json | null
          performance_review_frequency?: string | null
          priority_areas?: string[] | null
          profile_completed?: boolean | null
          recommended_modules?: string[] | null
          recruitment_process?: Json | null
          saudization_percentage_goal?: number | null
          setup_duration_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          assessment_completed?: boolean | null
          company_id?: string
          company_size?: string
          completion_date?: string | null
          compliance_concerns?: string[] | null
          created_at?: string | null
          existing_hr_tools?: string[] | null
          hr_challenges?: string[] | null
          id?: string
          industry_type?: string
          leave_management_complexity?: string | null
          onboarding_completed?: boolean | null
          pain_points_ranking?: Json | null
          performance_review_frequency?: string | null
          priority_areas?: string[] | null
          profile_completed?: boolean | null
          recommended_modules?: string[] | null
          recruitment_process?: Json | null
          saudization_percentage_goal?: number | null
          setup_duration_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_letters: {
        Row: {
          created_at: string | null
          created_by: string | null
          employee_id: string
          expiry_date: string | null
          id: string
          lang: string
          reminder_day: number | null
          storage_path: string
          tenant_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          expiry_date?: string | null
          id?: string
          lang: string
          reminder_day?: number | null
          storage_path: string
          tenant_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          expiry_date?: string | null
          id?: string
          lang?: string
          reminder_day?: number | null
          storage_path?: string
          tenant_id?: string
          type?: string
        }
        Relationships: []
      }
      compliance_runs: {
        Row: {
          error: string | null
          id: string
          ran_at: string | null
          stats: Json | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          error?: string | null
          id?: string
          ran_at?: string | null
          stats?: Json | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          error?: string | null
          id?: string
          ran_at?: string | null
          stats?: Json | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: []
      }
      compliance_settings: {
        Row: {
          id: string
          iqama_reminders: number[] | null
          letter_footer_ar: string | null
          letter_footer_en: string | null
          saudization_green_threshold: number | null
          saudization_yellow_threshold: number | null
          tenant_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          iqama_reminders?: number[] | null
          letter_footer_ar?: string | null
          letter_footer_en?: string | null
          saudization_green_threshold?: number | null
          saudization_yellow_threshold?: number | null
          tenant_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          iqama_reminders?: number[] | null
          letter_footer_ar?: string | null
          letter_footer_en?: string | null
          saudization_green_threshold?: number | null
          saudization_yellow_threshold?: number | null
          tenant_id?: string
          updated_at?: string | null
          updated_by?: string | null
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
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      docs_events: {
        Row: {
          company_id: string
          created_at: string | null
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          updated_at: string | null
          upload_metadata: Json | null
          uploaded_by: string | null
          virus_scan_details: Json | null
          virus_scan_status: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          updated_at?: string | null
          upload_metadata?: Json | null
          uploaded_by?: string | null
          virus_scan_details?: Json | null
          virus_scan_status?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          document_type?: string
          employee_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          updated_at?: string | null
          upload_metadata?: Json | null
          uploaded_by?: string | null
          virus_scan_details?: Json | null
          virus_scan_status?: string | null
        }
        Relationships: []
      }
      document_intelligence: {
        Row: {
          action_items: Json | null
          ai_keywords_ar: string[] | null
          ai_keywords_en: string[] | null
          ai_summary_ar: string | null
          ai_summary_en: string | null
          compliance_flags: Json | null
          confidence_score: number | null
          created_at: string | null
          document_classification: string | null
          document_metadata: Json | null
          embeddings: string | null
          file_size_bytes: number
          file_type: string
          gosi_relevance: number | null
          government_entity_mentions: Json | null
          id: string
          key_entities: Json | null
          labor_law_relevance: number | null
          module_context: string
          original_file_name: string
          processing_completed_at: string | null
          processing_duration_ms: number | null
          processing_started_at: string | null
          processing_status: string | null
          raw_text: string | null
          saudi_law_references: Json | null
          saudization_relevance: number | null
          search_vector: unknown | null
          semantic_sections: Json | null
          storage_path: string
          structured_content: Json | null
          tenant_id: string
          updated_at: string | null
          upload_user_id: string | null
        }
        Insert: {
          action_items?: Json | null
          ai_keywords_ar?: string[] | null
          ai_keywords_en?: string[] | null
          ai_summary_ar?: string | null
          ai_summary_en?: string | null
          compliance_flags?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          document_classification?: string | null
          document_metadata?: Json | null
          embeddings?: string | null
          file_size_bytes: number
          file_type: string
          gosi_relevance?: number | null
          government_entity_mentions?: Json | null
          id?: string
          key_entities?: Json | null
          labor_law_relevance?: number | null
          module_context: string
          original_file_name: string
          processing_completed_at?: string | null
          processing_duration_ms?: number | null
          processing_started_at?: string | null
          processing_status?: string | null
          raw_text?: string | null
          saudi_law_references?: Json | null
          saudization_relevance?: number | null
          search_vector?: unknown | null
          semantic_sections?: Json | null
          storage_path: string
          structured_content?: Json | null
          tenant_id: string
          updated_at?: string | null
          upload_user_id?: string | null
        }
        Update: {
          action_items?: Json | null
          ai_keywords_ar?: string[] | null
          ai_keywords_en?: string[] | null
          ai_summary_ar?: string | null
          ai_summary_en?: string | null
          compliance_flags?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          document_classification?: string | null
          document_metadata?: Json | null
          embeddings?: string | null
          file_size_bytes?: number
          file_type?: string
          gosi_relevance?: number | null
          government_entity_mentions?: Json | null
          id?: string
          key_entities?: Json | null
          labor_law_relevance?: number | null
          module_context?: string
          original_file_name?: string
          processing_completed_at?: string | null
          processing_duration_ms?: number | null
          processing_started_at?: string | null
          processing_status?: string | null
          raw_text?: string | null
          saudi_law_references?: Json | null
          saudization_relevance?: number | null
          search_vector?: unknown | null
          semantic_sections?: Json | null
          storage_path?: string
          structured_content?: Json | null
          tenant_id?: string
          updated_at?: string | null
          upload_user_id?: string | null
        }
        Relationships: []
      }
      document_processing_layers: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          document_id: string
          error_message: string | null
          id: string
          layer_output: Json | null
          layer_status: string | null
          layer_type: string
          processing_model: string | null
          processing_prompt: string | null
          processing_time_ms: number | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          document_id: string
          error_message?: string | null
          id?: string
          layer_output?: Json | null
          layer_status?: string | null
          layer_type: string
          processing_model?: string | null
          processing_prompt?: string | null
          processing_time_ms?: number | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string
          error_message?: string | null
          id?: string
          layer_output?: Json | null
          layer_status?: string | null
          layer_type?: string
          processing_model?: string | null
          processing_prompt?: string | null
          processing_time_ms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_processing_layers_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_intelligence"
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
      dx_cases: {
        Row: {
          baseline_date: string | null
          created_at: string | null
          created_by: string | null
          id: string
          module: string
          name: string
          status: string
          tenant_id: string
        }
        Insert: {
          baseline_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          module: string
          name: string
          status?: string
          tenant_id: string
        }
        Update: {
          baseline_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          module?: string
          name?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dx_cases_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dx_flags: {
        Row: {
          case_id: string
          code: string
          created_at: string | null
          details: Json | null
          id: string
          scope: string | null
          scope_id: string | null
          severity: string
        }
        Insert: {
          case_id: string
          code: string
          created_at?: string | null
          details?: Json | null
          id?: string
          scope?: string | null
          scope_id?: string | null
          severity?: string
        }
        Update: {
          case_id?: string
          code?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          scope?: string | null
          scope_id?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "dx_flags_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "dx_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      dx_inputs: {
        Row: {
          case_id: string
          created_at: string | null
          id: string
          meta: Json | null
          ref: string | null
          snap_date: string
          source: string
        }
        Insert: {
          case_id: string
          created_at?: string | null
          id?: string
          meta?: Json | null
          ref?: string | null
          snap_date?: string
          source: string
        }
        Update: {
          case_id?: string
          created_at?: string | null
          id?: string
          meta?: Json | null
          ref?: string | null
          snap_date?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "dx_inputs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "dx_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      dx_insights: {
        Row: {
          case_id: string
          category: string
          confidence_score: number
          created_at: string
          description: string | null
          id: string
          impact_score: number
          insight_type: string
          metadata: Json
          severity: string
          title: string
        }
        Insert: {
          case_id: string
          category: string
          confidence_score?: number
          created_at?: string
          description?: string | null
          id?: string
          impact_score?: number
          insight_type: string
          metadata?: Json
          severity?: string
          title: string
        }
        Update: {
          case_id?: string
          category?: string
          confidence_score?: number
          created_at?: string
          description?: string | null
          id?: string
          impact_score?: number
          insight_type?: string
          metadata?: Json
          severity?: string
          title?: string
        }
        Relationships: []
      }
      dx_playbooks: {
        Row: {
          ai_summary: string | null
          case_id: string
          confidence: number | null
          created_at: string | null
          id: string
          initiatives: Json | null
          owner_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_summary?: string | null
          case_id: string
          confidence?: number | null
          created_at?: string | null
          id?: string
          initiatives?: Json | null
          owner_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_summary?: string | null
          case_id?: string
          confidence?: number | null
          created_at?: string | null
          id?: string
          initiatives?: Json | null
          owner_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dx_playbooks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "dx_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      dx_scores: {
        Row: {
          case_id: string
          created_at: string | null
          id: string
          last_computed_at: string | null
          metric: Json
          n: number | null
          scope: string
          scope_id: string | null
        }
        Insert: {
          case_id: string
          created_at?: string | null
          id?: string
          last_computed_at?: string | null
          metric?: Json
          n?: number | null
          scope: string
          scope_id?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string | null
          id?: string
          last_computed_at?: string | null
          metric?: Json
          n?: number | null
          scope?: string
          scope_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dx_scores_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "dx_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_allowances: {
        Row: {
          allowance_id: string
          amount: number
          created_at: string
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          is_active: boolean
        }
        Insert: {
          allowance_id: string
          amount?: number
          created_at?: string
          effective_from: string
          effective_to?: string | null
          employee_id: string
          id?: string
          is_active?: boolean
        }
        Update: {
          allowance_id?: string
          amount?: number
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "employee_allowances_allowance_id_fkey"
            columns: ["allowance_id"]
            isOneToOne: false
            referencedRelation: "allowance_definitions"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "employee_benefits_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "employee_gosi_config_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_gosi_config_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees_safe"
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
      employee_leave_balances: {
        Row: {
          carried_forward: number
          created_at: string
          employee_id: string
          id: string
          last_calculated_at: string
          leave_type_id: string
          remaining_days: number
          total_entitlement: number
          used_days: number
          year: number
        }
        Insert: {
          carried_forward?: number
          created_at?: string
          employee_id: string
          id?: string
          last_calculated_at?: string
          leave_type_id: string
          remaining_days?: number
          total_entitlement?: number
          used_days?: number
          year: number
        }
        Update: {
          carried_forward?: number
          created_at?: string
          employee_id?: string
          id?: string
          last_calculated_at?: string
          leave_type_id?: string
          remaining_days?: number
          total_entitlement?: number
          used_days?: number
          year?: number
        }
        Relationships: []
      }
      employee_loans: {
        Row: {
          approval_details: Json | null
          created_at: string
          employee_id: string
          end_date: string
          id: string
          installments_paid: number
          installments_total: number
          interest_rate: number
          loan_amount: number
          loan_type: string
          monthly_deduction: number
          remaining_amount: number
          start_date: string
          status: string
        }
        Insert: {
          approval_details?: Json | null
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          installments_paid?: number
          installments_total: number
          interest_rate?: number
          loan_amount: number
          loan_type: string
          monthly_deduction: number
          remaining_amount: number
          start_date: string
          status?: string
        }
        Update: {
          approval_details?: Json | null
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          installments_paid?: number
          installments_total?: number
          interest_rate?: number
          loan_amount?: number
          loan_type?: string
          monthly_deduction?: number
          remaining_amount?: number
          start_date?: string
          status?: string
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
            foreignKeyName: "employee_positions_direct_manager_id_fkey"
            columns: ["direct_manager_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_positions_direct_manager_id_fkey"
            columns: ["direct_manager_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "employee_positions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_positions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "employee_schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      end_of_service_calculations: {
        Row: {
          allowances_included: number
          basic_salary: number
          calculation_base: number
          calculation_date: string
          calculation_details: Json
          created_at: string
          employee_id: string
          eos_amount: number
          id: string
          reason: string
          service_months: number
          service_years: number
          status: string
          total_service_days: number
        }
        Insert: {
          allowances_included?: number
          basic_salary: number
          calculation_base: number
          calculation_date: string
          calculation_details?: Json
          created_at?: string
          employee_id: string
          eos_amount: number
          id?: string
          reason: string
          service_months: number
          service_years: number
          status?: string
          total_service_days: number
        }
        Update: {
          allowances_included?: number
          basic_salary?: number
          calculation_base?: number
          calculation_date?: string
          calculation_details?: Json
          created_at?: string
          employee_id?: string
          eos_amount?: number
          id?: string
          reason?: string
          service_months?: number
          service_years?: number
          status?: string
          total_service_days?: number
        }
        Relationships: []
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
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          feature_code: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_code: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_code?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          feature_name: string
          id: string
          is_active: boolean | null
          plans: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          feature_name: string
          id?: string
          is_active?: boolean | null
          plans?: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          feature_name?: string
          id?: string
          is_active?: boolean | null
          plans?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      geo_pulses: {
        Row: {
          channel: string
          content: Json
          created_at: string
          id: string
          is_active: boolean
          schedule: Json
          sent_at: string | null
          status: string
          target_audience: Json
          tenant_id: string
          topic: string
          updated_at: string
        }
        Insert: {
          channel?: string
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          schedule?: Json
          sent_at?: string | null
          status?: string
          target_audience?: Json
          tenant_id: string
          topic: string
          updated_at?: string
        }
        Update: {
          channel?: string
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          schedule?: Json
          sent_at?: string | null
          status?: string
          target_audience?: Json
          tenant_id?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      geo_reactions: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          n_issue: number
          n_ok: number
          pulse_id: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          n_issue?: number
          n_ok?: number
          pulse_id: string
          reaction_type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          n_issue?: number
          n_ok?: number
          pulse_id?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "geo_reactions_pulse_id_fkey"
            columns: ["pulse_id"]
            isOneToOne: false
            referencedRelation: "geo_pulses"
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
      gosi_sync_logs: {
        Row: {
          company_id: string
          created_at: string
          id: string
          records_failed: number
          records_processed: number
          records_success: number
          status: string
          sync_date: string
          sync_details: Json | null
          sync_type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          records_failed?: number
          records_processed?: number
          records_success?: number
          status?: string
          sync_date?: string
          sync_details?: Json | null
          sync_type: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          records_failed?: number
          records_processed?: number
          records_success?: number
          status?: string
          sync_date?: string
          sync_details?: Json | null
          sync_type?: string
        }
        Relationships: []
      }
      gov_adapters: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          last_error: string | null
          last_sync: string | null
          mode: string | null
          notes: string | null
          status: string | null
          system: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          last_sync?: string | null
          mode?: string | null
          notes?: string | null
          status?: string | null
          system: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          last_sync?: string | null
          mode?: string | null
          notes?: string | null
          status?: string | null
          system?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gov_changes: {
        Row: {
          change_type: string
          created_at: string | null
          effective_date: string | null
          id: string
          payload: Json | null
          processed: boolean | null
          reference: string | null
          system: string
          tenant_id: string
        }
        Insert: {
          change_type: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          reference?: string | null
          system: string
          tenant_id: string
        }
        Update: {
          change_type?: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          reference?: string | null
          system?: string
          tenant_id?: string
        }
        Relationships: []
      }
      gov_documents: {
        Row: {
          ai_tags: string[] | null
          checksum: string | null
          created_at: string | null
          entity_id: string | null
          file_size: number | null
          id: string
          meta: Json | null
          mime_type: string | null
          module: string | null
          storage_path: string | null
          system: string
          tags: string[] | null
          tenant_id: string
          title: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          ai_tags?: string[] | null
          checksum?: string | null
          created_at?: string | null
          entity_id?: string | null
          file_size?: number | null
          id?: string
          meta?: Json | null
          mime_type?: string | null
          module?: string | null
          storage_path?: string | null
          system: string
          tags?: string[] | null
          tenant_id: string
          title?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          ai_tags?: string[] | null
          checksum?: string | null
          created_at?: string | null
          entity_id?: string | null
          file_size?: number | null
          id?: string
          meta?: Json | null
          mime_type?: string | null
          module?: string | null
          storage_path?: string | null
          system?: string
          tags?: string[] | null
          tenant_id?: string
          title?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      gov_events: {
        Row: {
          data: Json | null
          event_at: string | null
          id: string
          kind: string | null
          message: string | null
          severity: string | null
          system: string
          tenant_id: string
        }
        Insert: {
          data?: Json | null
          event_at?: string | null
          id?: string
          kind?: string | null
          message?: string | null
          severity?: string | null
          system: string
          tenant_id: string
        }
        Update: {
          data?: Json | null
          event_at?: string | null
          id?: string
          kind?: string | null
          message?: string | null
          severity?: string | null
          system?: string
          tenant_id?: string
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
      gov_integration_workflows: {
        Row: {
          created_at: string | null
          description: string | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          next_run_at: string | null
          steps: Json
          success_count: number | null
          tenant_id: string
          triggers: Json | null
          updated_at: string | null
          workflow_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string | null
          steps?: Json
          success_count?: number | null
          tenant_id: string
          triggers?: Json | null
          updated_at?: string | null
          workflow_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string | null
          steps?: Json
          success_count?: number | null
          tenant_id?: string
          triggers?: Json | null
          updated_at?: string | null
          workflow_name?: string
        }
        Relationships: []
      }
      gov_integrations: {
        Row: {
          api_credentials: Json | null
          connection_config: Json | null
          created_at: string
          error_count: number
          id: string
          is_connected: boolean
          is_enabled: boolean
          last_error_at: string | null
          last_error_message: string | null
          last_sync_at: string | null
          last_sync_status: string | null
          next_sync_at: string | null
          sync_frequency: string
          sync_settings: Json | null
          system: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          api_credentials?: Json | null
          connection_config?: Json | null
          created_at?: string
          error_count?: number
          id?: string
          is_connected?: boolean
          is_enabled?: boolean
          last_error_at?: string | null
          last_error_message?: string | null
          last_sync_at?: string | null
          last_sync_status?: string | null
          next_sync_at?: string | null
          sync_frequency?: string
          sync_settings?: Json | null
          system: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          api_credentials?: Json | null
          connection_config?: Json | null
          created_at?: string
          error_count?: number
          id?: string
          is_connected?: boolean
          is_enabled?: boolean
          last_error_at?: string | null
          last_error_message?: string | null
          last_sync_at?: string | null
          last_sync_status?: string | null
          next_sync_at?: string | null
          sync_frequency?: string
          sync_settings?: Json | null
          system?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      gov_simulator_configs: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          mock_data_config: Json | null
          response_delay_ms: number | null
          scenarios: Json | null
          success_rate: number | null
          system: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          mock_data_config?: Json | null
          response_delay_ms?: number | null
          scenarios?: Json | null
          success_rate?: number | null
          system: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          mock_data_config?: Json | null
          response_delay_ms?: number | null
          scenarios?: Json | null
          success_rate?: number | null
          system?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gov_sync_jobs: {
        Row: {
          created_at: string | null
          error: string | null
          finished_at: string | null
          id: string
          job_type: string
          payload: Json | null
          result: Json | null
          started_at: string | null
          status: string | null
          system: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          job_type: string
          payload?: Json | null
          result?: Json | null
          started_at?: string | null
          status?: string | null
          system: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          job_type?: string
          payload?: Json | null
          result?: Json | null
          started_at?: string | null
          status?: string | null
          system?: string
          tenant_id?: string
        }
        Relationships: []
      }
      gov_sync_logs: {
        Row: {
          created_at: string
          error_message: string | null
          finished_at: string | null
          id: string
          payload: Json | null
          records_created: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          response_data: Json | null
          started_at: string
          status: string
          sync_type: string
          system: string
          tenant_id: string
          test_mode: boolean
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          payload?: Json | null
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          response_data?: Json | null
          started_at?: string
          status?: string
          sync_type?: string
          system: string
          tenant_id: string
          test_mode?: boolean
        }
        Update: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          payload?: Json | null
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          response_data?: Json | null
          started_at?: string
          status?: string
          sync_type?: string
          system?: string
          tenant_id?: string
          test_mode?: boolean
        }
        Relationships: []
      }
      government_api_logs: {
        Row: {
          company_id: string
          created_at: string | null
          endpoint: string
          error_message: string | null
          http_method: string
          id: string
          operation_type: string
          portal_code: string
          request_id: string
          request_payload: Json | null
          response_payload: Json | null
          response_status: number | null
          response_time_ms: number | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          endpoint: string
          error_message?: string | null
          http_method: string
          id?: string
          operation_type: string
          portal_code: string
          request_id: string
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          endpoint?: string
          error_message?: string | null
          http_method?: string
          id?: string
          operation_type?: string
          portal_code?: string
          request_id?: string
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "government_compliance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "government_compliance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      government_compliance_status: {
        Row: {
          auto_remediation_enabled: boolean | null
          company_id: string
          compliance_type: string
          created_at: string | null
          details: Json | null
          id: string
          last_checked_at: string | null
          next_check_due: string | null
          portal_code: string
          status: string
          updated_at: string | null
        }
        Insert: {
          auto_remediation_enabled?: boolean | null
          company_id: string
          compliance_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          last_checked_at?: string | null
          next_check_due?: string | null
          portal_code: string
          status: string
          updated_at?: string | null
        }
        Update: {
          auto_remediation_enabled?: boolean | null
          company_id?: string
          compliance_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          last_checked_at?: string | null
          next_check_due?: string | null
          portal_code?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
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
      government_portals: {
        Row: {
          api_base_url: string | null
          created_at: string | null
          documentation_url: string | null
          id: string
          portal_category: string
          portal_code: string
          portal_name_ar: string
          portal_name_en: string
          rate_limits: Json | null
          status: string | null
          supported_operations: Json | null
          updated_at: string | null
        }
        Insert: {
          api_base_url?: string | null
          created_at?: string | null
          documentation_url?: string | null
          id?: string
          portal_category: string
          portal_code: string
          portal_name_ar: string
          portal_name_en: string
          rate_limits?: Json | null
          status?: string | null
          supported_operations?: Json | null
          updated_at?: string | null
        }
        Update: {
          api_base_url?: string | null
          created_at?: string | null
          documentation_url?: string | null
          id?: string
          portal_category?: string
          portal_code?: string
          portal_name_ar?: string
          portal_name_en?: string
          rate_limits?: Json | null
          status?: string | null
          supported_operations?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hofstede_national_scores: {
        Row: {
          country_code: string
          country_name_ar: string | null
          country_name_en: string
          created_at: string | null
          id: string
          individualism: number | null
          indulgence: number | null
          long_term_orientation: number | null
          masculinity: number | null
          power_distance: number | null
          uncertainty_avoidance: number | null
        }
        Insert: {
          country_code: string
          country_name_ar?: string | null
          country_name_en: string
          created_at?: string | null
          id?: string
          individualism?: number | null
          indulgence?: number | null
          long_term_orientation?: number | null
          masculinity?: number | null
          power_distance?: number | null
          uncertainty_avoidance?: number | null
        }
        Update: {
          country_code?: string
          country_name_ar?: string | null
          country_name_en?: string
          created_at?: string | null
          id?: string
          individualism?: number | null
          indulgence?: number | null
          long_term_orientation?: number | null
          masculinity?: number | null
          power_distance?: number | null
          uncertainty_avoidance?: number | null
        }
        Relationships: []
      }
      hr_attendance: {
        Row: {
          company_id: string
          employee_id: string
          id: string
          overtime_minutes: number | null
          tardy_minutes: number | null
          work_date: string
        }
        Insert: {
          company_id: string
          employee_id: string
          id?: string
          overtime_minutes?: number | null
          tardy_minutes?: number | null
          work_date: string
        }
        Update: {
          company_id?: string
          employee_id?: string
          id?: string
          overtime_minutes?: number | null
          tardy_minutes?: number | null
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "osi_span_v1"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_costs"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "hr_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_manager_spans"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_org_current"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_departments: {
        Row: {
          code: string
          company_id: string
          created_at: string | null
          id: string
          name_ar: string
          name_en: string
          parent_id: string | null
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string | null
          id?: string
          name_ar: string
          name_en: string
          parent_id?: string | null
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_departments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_exits: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
          exit_date: string
          id: string
          reason: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
          exit_date: string
          id?: string
          reason?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
          exit_date?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      hr_employees: {
        Row: {
          allowances: number | null
          audit_metadata: Json | null
          base_salary: number | null
          company_id: string
          created_at: string | null
          data_retention_policy: Json | null
          department_id: string | null
          dept_id: string | null
          dob: string | null
          employee_no: string
          employment_status: string | null
          first_name: string | null
          full_name_ar: string
          full_name_en: string
          gender: string
          grade_id: string | null
          hire_date: string
          id: string
          iqama_expiry: string | null
          is_saudi: boolean
          job_id: string | null
          last_name: string | null
          location_id: string | null
          manager_id: string | null
          monthly_salary: number | null
          nationality: string | null
          nationality_code: string
          termination_date: string | null
        }
        Insert: {
          allowances?: number | null
          audit_metadata?: Json | null
          base_salary?: number | null
          company_id: string
          created_at?: string | null
          data_retention_policy?: Json | null
          department_id?: string | null
          dept_id?: string | null
          dob?: string | null
          employee_no: string
          employment_status?: string | null
          first_name?: string | null
          full_name_ar: string
          full_name_en: string
          gender: string
          grade_id?: string | null
          hire_date: string
          id?: string
          iqama_expiry?: string | null
          is_saudi: boolean
          job_id?: string | null
          last_name?: string | null
          location_id?: string | null
          manager_id?: string | null
          monthly_salary?: number | null
          nationality?: string | null
          nationality_code: string
          termination_date?: string | null
        }
        Update: {
          allowances?: number | null
          audit_metadata?: Json | null
          base_salary?: number | null
          company_id?: string
          created_at?: string | null
          data_retention_policy?: Json | null
          department_id?: string | null
          dept_id?: string | null
          dob?: string | null
          employee_no?: string
          employment_status?: string | null
          first_name?: string | null
          full_name_ar?: string
          full_name_en?: string
          gender?: string
          grade_id?: string | null
          hire_date?: string
          id?: string
          iqama_expiry?: string | null
          is_saudi?: boolean
          job_id?: string | null
          last_name?: string | null
          location_id?: string | null
          manager_id?: string | null
          monthly_salary?: number | null
          nationality?: string | null
          nationality_code?: string
          termination_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employees_dept_id_fkey"
            columns: ["dept_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "hr_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "hr_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "hr_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "osi_span_v1"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_costs"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_manager_spans"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_org_current"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_grades: {
        Row: {
          code: string
          company_id: string
          id: string
          max_salary: number | null
          min_salary: number | null
        }
        Insert: {
          code: string
          company_id: string
          id?: string
          max_salary?: number | null
          min_salary?: number | null
        }
        Update: {
          code?: string
          company_id?: string
          id?: string
          max_salary?: number | null
          min_salary?: number | null
        }
        Relationships: []
      }
      hr_jobs: {
        Row: {
          code: string
          company_id: string
          family: string | null
          id: string
          title_ar: string
          title_en: string
        }
        Insert: {
          code: string
          company_id: string
          family?: string | null
          id?: string
          title_ar: string
          title_en: string
        }
        Update: {
          code?: string
          company_id?: string
          family?: string | null
          id?: string
          title_ar?: string
          title_en?: string
        }
        Relationships: []
      }
      hr_leaves: {
        Row: {
          company_id: string
          days: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          start_date: string
        }
        Insert: {
          company_id: string
          days: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          start_date: string
        }
        Update: {
          company_id?: string
          days?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "osi_span_v1"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_costs"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "hr_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_manager_spans"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_org_current"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_locations: {
        Row: {
          company_id: string
          id: string
          name_ar: string
          name_en: string
        }
        Insert: {
          company_id: string
          id?: string
          name_ar: string
          name_en: string
        }
        Update: {
          company_id?: string
          id?: string
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      hr_training: {
        Row: {
          company_id: string
          completed_at: string | null
          course_name: string | null
          employee_id: string | null
          hours: number | null
          id: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          course_name?: string | null
          employee_id?: string | null
          hours?: number | null
          id?: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          course_name?: string | null
          employee_id?: string | null
          hours?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "osi_span_v1"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_costs"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "hr_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_manager_spans"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "v_org_current"
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
          {
            foreignKeyName: "hse_compliance_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_compliance_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "hse_emergency_team_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_emergency_team_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "hse_emergency_teams_team_leader_id_fkey"
            columns: ["team_leader_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_emergency_teams_team_leader_id_fkey"
            columns: ["team_leader_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "hse_incidents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_incidents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_incidents_investigator_id_fkey"
            columns: ["investigator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_incidents_investigator_id_fkey"
            columns: ["investigator_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_incidents_investigator_id_fkey"
            columns: ["investigator_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "hse_kpis_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_kpis_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "hse_medical_surveillance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_medical_surveillance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "hse_ppe_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_ppe_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "hse_risk_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_risk_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "hse_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hse_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          category: string
          company_id: string
          id: string
          last_sync: string | null
          name: string
          status: string
        }
        Insert: {
          category: string
          company_id: string
          id?: string
          last_sync?: string | null
          name: string
          status?: string
        }
        Update: {
          category?: string
          company_id?: string
          id?: string
          last_sync?: string | null
          name?: string
          status?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "job_applications_screened_by_fkey"
            columns: ["screened_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_screened_by_fkey"
            columns: ["screened_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "job_postings_hiring_manager_id_fkey"
            columns: ["hiring_manager_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_hiring_manager_id_fkey"
            columns: ["hiring_manager_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "job_postings_hr_contact_id_fkey"
            columns: ["hr_contact_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_hr_contact_id_fkey"
            columns: ["hr_contact_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      kpi_snapshots: {
        Row: {
          active_users: number | null
          company_id: string
          compliance_score: number | null
          docs_processed: number | null
          employee_experience_10: number | null
          hse_safety_score: number | null
          id: string
          predictive_risk_high: number | null
          saudization_rate: number | null
          snap_date: string
          talent_pipeline_strength: number | null
          total_employees: number | null
          training_hours: number | null
          workforce_forecast_accuracy: number | null
        }
        Insert: {
          active_users?: number | null
          company_id: string
          compliance_score?: number | null
          docs_processed?: number | null
          employee_experience_10?: number | null
          hse_safety_score?: number | null
          id?: string
          predictive_risk_high?: number | null
          saudization_rate?: number | null
          snap_date?: string
          talent_pipeline_strength?: number | null
          total_employees?: number | null
          training_hours?: number | null
          workforce_forecast_accuracy?: number | null
        }
        Update: {
          active_users?: number | null
          company_id?: string
          compliance_score?: number | null
          docs_processed?: number | null
          employee_experience_10?: number | null
          hse_safety_score?: number | null
          id?: string
          predictive_risk_high?: number | null
          saudization_rate?: number | null
          snap_date?: string
          talent_pipeline_strength?: number | null
          total_employees?: number | null
          training_hours?: number | null
          workforce_forecast_accuracy?: number | null
        }
        Relationships: []
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
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "leave_requests_current_approver_id_fkey"
            columns: ["current_approver_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_current_approver_id_fkey"
            columns: ["current_approver_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "leave_requests_final_approver_id_fkey"
            columns: ["final_approver_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_final_approver_id_fkey"
            columns: ["final_approver_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_hr_processed_by_fkey"
            columns: ["hr_processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_hr_processed_by_fkey"
            columns: ["hr_processed_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_hr_processed_by_fkey"
            columns: ["hr_processed_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      leo_paths: {
        Row: {
          created_at: string
          grade: string
          id: string
          is_active: boolean
          path: Json
          skill: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade: string
          id?: string
          is_active?: boolean
          path?: Json
          skill: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade?: string
          id?: string
          is_active?: boolean
          path?: Json
          skill?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leo_progress: {
        Row: {
          created_at: string
          employee_id: string
          hours: number
          id: string
          last_event_at: string
          skill: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          hours?: number
          id?: string
          last_event_at?: string
          skill: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          hours?: number
          id?: string
          last_event_at?: string
          skill?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      medical_data_audit_log: {
        Row: {
          access_type: string
          company_id: string
          created_at: string | null
          data_accessed: Json | null
          employee_id: string
          id: string
          ip_address: unknown | null
          justification: string | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_type: string
          company_id: string
          created_at?: string | null
          data_accessed?: Json | null
          employee_id: string
          id?: string
          ip_address?: unknown | null
          justification?: string | null
          table_name?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          company_id?: string
          created_at?: string | null
          data_accessed?: Json | null
          employee_id?: string
          id?: string
          ip_address?: unknown | null
          justification?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "mobile_attendance_sessions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mobile_attendance_sessions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "mobile_devices_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mobile_devices_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      notifications: {
        Row: {
          channel: string | null
          created_at: string | null
          error_details: Json | null
          id: string
          message: string
          sent_at: string | null
          status: string | null
          task_id: string | null
          tenant_id: string
          to_email: string | null
          to_user_id: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          error_details?: Json | null
          id?: string
          message: string
          sent_at?: string | null
          status?: string | null
          task_id?: string | null
          tenant_id: string
          to_email?: string | null
          to_user_id?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          error_details?: Json | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string | null
          task_id?: string | null
          tenant_id?: string
          to_email?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      osi_benchmarks: {
        Row: {
          function: string
          grade: string
          max_layers: number
          target_cost_to_manage: number
          target_span: number
        }
        Insert: {
          function: string
          grade: string
          max_layers: number
          target_cost_to_manage: number
          target_span: number
        }
        Update: {
          function?: string
          grade?: string
          max_layers?: number
          target_cost_to_manage?: number
          target_span?: number
        }
        Relationships: []
      }
      osi_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          saudi_target: number | null
          span_max: number | null
          span_min: number | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          saudi_target?: number | null
          span_max?: number | null
          span_min?: number | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          saudi_target?: number | null
          span_max?: number | null
          span_min?: number | null
          tenant_id?: string
        }
        Relationships: []
      }
      osi_snapshots: {
        Row: {
          case_id: string
          cost_to_manage: number | null
          cost_total: number | null
          created_at: string | null
          duplicate_titles_n: number | null
          female_pct: number | null
          flags: string[] | null
          headcount: number
          id: string
          layers_depth: number | null
          manager_overload_n: number | null
          managers: number
          n: number | null
          saudization: number | null
          scope: string
          scope_id: string | null
          span_avg: number | null
          span_p90: number | null
          vacant_positions_n: number | null
        }
        Insert: {
          case_id: string
          cost_to_manage?: number | null
          cost_total?: number | null
          created_at?: string | null
          duplicate_titles_n?: number | null
          female_pct?: number | null
          flags?: string[] | null
          headcount?: number
          id?: string
          layers_depth?: number | null
          manager_overload_n?: number | null
          managers?: number
          n?: number | null
          saudization?: number | null
          scope: string
          scope_id?: string | null
          span_avg?: number | null
          span_p90?: number | null
          vacant_positions_n?: number | null
        }
        Update: {
          case_id?: string
          cost_to_manage?: number | null
          cost_total?: number | null
          created_at?: string | null
          duplicate_titles_n?: number | null
          female_pct?: number | null
          flags?: string[] | null
          headcount?: number
          id?: string
          layers_depth?: number | null
          manager_overload_n?: number | null
          managers?: number
          n?: number | null
          saudization?: number | null
          scope?: string
          scope_id?: string | null
          span_avg?: number | null
          span_p90?: number | null
          vacant_positions_n?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "osi_snapshots_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "dx_cases"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "overtime_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "overtime_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      payroll_configurations: {
        Row: {
          company_id: string
          config_name: string
          config_type: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          rules: Json
          updated_at: string
        }
        Insert: {
          company_id: string
          config_name: string
          config_type: string
          created_at?: string
          effective_from: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          rules?: Json
          updated_at?: string
        }
        Update: {
          company_id?: string
          config_name?: string
          config_type?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          rules?: Json
          updated_at?: string
        }
        Relationships: []
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
            foreignKeyName: "payroll_periods_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "payroll_periods_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "performance_reviews_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      pii_catalog: {
        Row: {
          column_name: string
          created_at: string | null
          id: string
          pii_type: string
          purpose: string | null
          retention_days: number | null
          table_name: string
        }
        Insert: {
          column_name: string
          created_at?: string | null
          id?: string
          pii_type: string
          purpose?: string | null
          retention_days?: number | null
          table_name: string
        }
        Update: {
          column_name?: string
          created_at?: string | null
          id?: string
          pii_type?: string
          purpose?: string | null
          retention_days?: number | null
          table_name?: string
        }
        Relationships: []
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
      plan_bundles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          included_skus: string[]
          is_active: boolean
          is_popular: boolean
          plan_code: string
          plan_name: string
          price_annual: number
          price_monthly: number
          trial_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          included_skus?: string[]
          is_active?: boolean
          is_popular?: boolean
          plan_code: string
          plan_name: string
          price_annual?: number
          price_monthly?: number
          trial_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          included_skus?: string[]
          is_active?: boolean
          is_popular?: boolean
          plan_code?: string
          plan_name?: string
          price_annual?: number
          price_monthly?: number
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          created_at: string | null
          feature_key: string
          id: string
          is_enabled: boolean | null
          plan_name: string
        }
        Insert: {
          created_at?: string | null
          feature_key: string
          id?: string
          is_enabled?: boolean | null
          plan_name: string
        }
        Update: {
          created_at?: string | null
          feature_key?: string
          id?: string
          is_enabled?: boolean | null
          plan_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["feature_key"]
          },
        ]
      }
      plans: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          features: string[]
          id: string
          is_active: boolean | null
          name: string
          price_mo: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean | null
          name: string
          price_mo?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean | null
          name?: string
          price_mo?: number
          sort_order?: number | null
          updated_at?: string | null
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
          language: string | null
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
          language?: string | null
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
          language?: string | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prompt_logs: {
        Row: {
          ai_response: string
          category: string
          commit_hash: string | null
          company_id: string
          created_at: string
          git_commit_hash: string | null
          id: string
          implementation_notes: string | null
          priority: string
          status: string
          summary: string | null
          updated_at: string
          user_id: string
          user_prompt: string
        }
        Insert: {
          ai_response: string
          category?: string
          commit_hash?: string | null
          company_id: string
          created_at?: string
          git_commit_hash?: string | null
          id?: string
          implementation_notes?: string | null
          priority?: string
          status?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
          user_prompt: string
        }
        Update: {
          ai_response?: string
          category?: string
          commit_hash?: string | null
          company_id?: string
          created_at?: string
          git_commit_hash?: string | null
          id?: string
          implementation_notes?: string | null
          priority?: string
          status?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
          user_prompt?: string
        }
        Relationships: []
      }
      retention_actions: {
        Row: {
          created_at: string | null
          description: string | null
          evidence: Json | null
          id: string
          owner_id: string | null
          period_month: string
          priority: string | null
          scope: string
          scope_id: string | null
          status: string | null
          tenant_id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          evidence?: Json | null
          id?: string
          owner_id?: string | null
          period_month: string
          priority?: string | null
          scope: string
          scope_id?: string | null
          status?: string | null
          tenant_id: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          evidence?: Json | null
          id?: string
          owner_id?: string | null
          period_month?: string
          priority?: string | null
          scope?: string
          scope_id?: string | null
          status?: string | null
          tenant_id?: string
          title?: string | null
        }
        Relationships: []
      }
      retention_config: {
        Row: {
          band_thresholds: Json | null
          created_at: string | null
          min_group_n: number | null
          target_turnover: number | null
          tenant_id: string
        }
        Insert: {
          band_thresholds?: Json | null
          created_at?: string | null
          min_group_n?: number | null
          target_turnover?: number | null
          tenant_id: string
        }
        Update: {
          band_thresholds?: Json | null
          created_at?: string | null
          min_group_n?: number | null
          target_turnover?: number | null
          tenant_id?: string
        }
        Relationships: []
      }
      retention_features: {
        Row: {
          created_at: string | null
          employee_id: string
          features: Json
          id: string
          period_month: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          features: Json
          id?: string
          period_month: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          features?: Json
          id?: string
          period_month?: string
          tenant_id?: string
        }
        Relationships: []
      }
      retention_risks: {
        Row: {
          band: string
          created_at: string | null
          employee_id: string
          id: string
          period_month: string
          risk_score: number
          tenant_id: string
          top_factors: Json | null
        }
        Insert: {
          band: string
          created_at?: string | null
          employee_id: string
          id?: string
          period_month: string
          risk_score: number
          tenant_id: string
          top_factors?: Json | null
        }
        Update: {
          band?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          period_month?: string
          risk_score?: number
          tenant_id?: string
          top_factors?: Json | null
        }
        Relationships: []
      }
      rew_snapshots: {
        Row: {
          case_id: string
          created_at: string | null
          id: string
          n: number | null
          risk_score: number
          scope: string
          scope_id: string | null
          top_drivers: Json | null
        }
        Insert: {
          case_id: string
          created_at?: string | null
          id?: string
          n?: number | null
          risk_score?: number
          scope: string
          scope_id?: string | null
          top_drivers?: Json | null
        }
        Update: {
          case_id?: string
          created_at?: string | null
          id?: string
          n?: number | null
          risk_score?: number
          scope?: string
          scope_id?: string | null
          top_drivers?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "rew_snapshots_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "dx_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_leads: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          created_at: string
          id: string
          lead_type: string
          message: string | null
          metadata: Json | null
          requested_plan: string | null
          requested_sku: string | null
          status: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          lead_type?: string
          message?: string | null
          metadata?: Json | null
          requested_plan?: string | null
          requested_sku?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          lead_type?: string
          message?: string | null
          metadata?: Json | null
          requested_plan?: string | null
          requested_sku?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
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
          data_retention_policy: Json | null
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
          data_retention_policy?: Json | null
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
          data_retention_policy?: Json | null
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
      saudi_legal_framework: {
        Row: {
          authority: string
          category: string
          compliance_requirements: Json | null
          created_at: string | null
          document_urls: string[] | null
          effective_date: string
          id: string
          key_articles: Json | null
          keywords_ar: string[] | null
          keywords_en: string[] | null
          last_amended: string | null
          law_code: string
          law_name_ar: string
          law_name_en: string
          penalties: Json | null
          related_laws: string[] | null
          status: string
          summary_ar: string
          summary_en: string
          updated_at: string | null
        }
        Insert: {
          authority: string
          category: string
          compliance_requirements?: Json | null
          created_at?: string | null
          document_urls?: string[] | null
          effective_date: string
          id?: string
          key_articles?: Json | null
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_amended?: string | null
          law_code: string
          law_name_ar: string
          law_name_en: string
          penalties?: Json | null
          related_laws?: string[] | null
          status?: string
          summary_ar: string
          summary_en: string
          updated_at?: string | null
        }
        Update: {
          authority?: string
          category?: string
          compliance_requirements?: Json | null
          created_at?: string | null
          document_urls?: string[] | null
          effective_date?: string
          id?: string
          key_articles?: Json | null
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_amended?: string | null
          law_code?: string
          law_name_ar?: string
          law_name_en?: string
          penalties?: Json | null
          related_laws?: string[] | null
          status?: string
          summary_ar?: string
          summary_en?: string
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
      security_config: {
        Row: {
          audit_retention_days: number
          created_at: string
          data_encryption_at_rest: boolean
          id: string
          lockout_duration_minutes: number
          login_attempt_limit: number
          password_min_length: number
          password_require_special: boolean
          require_2fa_for_admins: boolean
          require_session_confirmation: boolean
          session_idle_timeout_minutes: number
          session_max_duration_hours: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          audit_retention_days?: number
          created_at?: string
          data_encryption_at_rest?: boolean
          id?: string
          lockout_duration_minutes?: number
          login_attempt_limit?: number
          password_min_length?: number
          password_require_special?: boolean
          require_2fa_for_admins?: boolean
          require_session_confirmation?: boolean
          session_idle_timeout_minutes?: number
          session_max_duration_hours?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          audit_retention_days?: number
          created_at?: string
          data_encryption_at_rest?: boolean
          id?: string
          lockout_duration_minutes?: number
          login_attempt_limit?: number
          password_min_length?: number
          password_require_special?: boolean
          require_2fa_for_admins?: boolean
          require_session_confirmation?: boolean
          session_idle_timeout_minutes?: number
          session_max_duration_hours?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_exceptions: {
        Row: {
          approved_by: string | null
          created_at: string | null
          exception_type: string
          function_name: string
          id: string
          justification: string
          reviewed_by: string | null
          schema_name: string
          security_review_date: string
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          exception_type?: string
          function_name: string
          id?: string
          justification: string
          reviewed_by?: string | null
          schema_name?: string
          security_review_date?: string
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          exception_type?: string
          function_name?: string
          id?: string
          justification?: string
          reviewed_by?: string | null
          schema_name?: string
          security_review_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      share_links: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string
          id: string
          kind: string
          payload: Json | null
          tenant_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at: string
          id?: string
          kind: string
          payload?: Json | null
          tenant_id: string
          token: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string
          id?: string
          kind?: string
          payload?: Json | null
          tenant_id?: string
          token?: string
        }
        Relationships: []
      }
      sku_catalog: {
        Row: {
          category: string
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          price_annual: number
          price_monthly: number
          sku_code: string
          sku_name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          price_annual?: number
          price_monthly?: number
          sku_code: string
          sku_name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          price_annual?: number
          price_monthly?: number
          sku_code?: string
          sku_name?: string
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
      tasks: {
        Row: {
          closed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_at: string | null
          id: string
          metadata: Json | null
          module: string
          owner_role: string | null
          owner_user_id: string | null
          priority: string | null
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json | null
          module: string
          owner_role?: string | null
          owner_user_id?: string | null
          priority?: string | null
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json | null
          module?: string
          owner_role?: string | null
          owner_user_id?: string | null
          priority?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_entitlements: {
        Row: {
          active: boolean | null
          created_at: string | null
          ends_at: string | null
          id: string
          seats: number | null
          sku_code: string
          started_at: string | null
          tenant_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          seats?: number | null
          sku_code: string
          started_at?: string | null
          tenant_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          seats?: number | null
          sku_code?: string
          started_at?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_entitlements_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_features: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          feature_code: string
          id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          feature_code: string
          id?: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          feature_code?: string
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_features_feature_code_fkey"
            columns: ["feature_code"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["feature_code"]
          },
          {
            foreignKeyName: "tenant_features_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_localization_prefs: {
        Row: {
          created_at: string | null
          currency_symbol: string | null
          date_format: string | null
          decimal_separator: string | null
          default_calendar: string
          default_language: string
          id: string
          module_calendar_prefs: Json | null
          numeral_system: string
          tenant_id: string
          thousands_separator: string | null
          time_format: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency_symbol?: string | null
          date_format?: string | null
          decimal_separator?: string | null
          default_calendar?: string
          default_language?: string
          id?: string
          module_calendar_prefs?: Json | null
          numeral_system?: string
          tenant_id: string
          thousands_separator?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency_symbol?: string | null
          date_format?: string | null
          decimal_separator?: string | null
          default_calendar?: string
          default_language?: string
          id?: string
          module_calendar_prefs?: Json | null
          numeral_system?: string
          tenant_id?: string
          thousands_separator?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_plans: {
        Row: {
          active_from: string | null
          active_to: string | null
          created_at: string | null
          id: string
          is_trial: boolean | null
          plan_code: string
          seats: number
          tenant_id: string
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          created_at?: string | null
          id?: string
          is_trial?: boolean | null
          plan_code: string
          seats?: number
          tenant_id: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          created_at?: string | null
          id?: string
          is_trial?: boolean | null
          plan_code?: string
          seats?: number
          tenant_id?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_plans_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["code"]
          },
        ]
      }
      tenant_trials: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          plan_code: string
          requested_by: string | null
          started_at: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          plan_code: string
          requested_by?: string | null
          started_at?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          plan_code?: string
          requested_by?: string | null
          started_at?: string
          status?: string
          tenant_id?: string
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
            foreignKeyName: "training_enrollments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "training_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
          {
            foreignKeyName: "training_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "training_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
      ui_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          level: string | null
          message: string | null
          metadata: Json | null
          page: string
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string
          id?: string
          level?: string | null
          message?: string | null
          metadata?: Json | null
          page: string
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          level?: string | null
          message?: string | null
          metadata?: Json | null
          page?: string
          tenant_id?: string
          user_id?: string | null
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
      value_events: {
        Row: {
          created_at: string | null
          entity: string | null
          entity_id: string | null
          event_type: string
          hours_saved: number | null
          id: string
          payload: Json | null
          sar_saved: number | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          entity?: string | null
          entity_id?: string | null
          event_type: string
          hours_saved?: number | null
          id?: string
          payload?: Json | null
          sar_saved?: number | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          entity?: string | null
          entity_id?: string | null
          event_type?: string
          hours_saved?: number | null
          id?: string
          payload?: Json | null
          sar_saved?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "value_events_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      value_metrics_snapshots: {
        Row: {
          autopilot_runs: number | null
          docs: number | null
          est_hours_saved: number | null
          exports: number | null
          letters: number | null
          snap_date: string
          tasks: number | null
          tenant_id: string
        }
        Insert: {
          autopilot_runs?: number | null
          docs?: number | null
          est_hours_saved?: number | null
          exports?: number | null
          letters?: number | null
          snap_date: string
          tasks?: number | null
          tenant_id: string
        }
        Update: {
          autopilot_runs?: number | null
          docs?: number | null
          est_hours_saved?: number | null
          exports?: number | null
          letters?: number | null
          snap_date?: string
          tasks?: number | null
          tenant_id?: string
        }
        Relationships: []
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
            foreignKeyName: "workplace_transfers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "workplace_transfers_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_safe"
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
            foreignKeyName: "workplace_transfers_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees_full_pii"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workplace_transfers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      wps_submissions: {
        Row: {
          company_id: string
          created_at: string
          error_details: Json | null
          id: string
          molhri_response: Json | null
          payroll_run_id: string
          status: string
          submission_date: string
          wps_file_name: string
          wps_file_path: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          error_details?: Json | null
          id?: string
          molhri_response?: Json | null
          payroll_run_id: string
          status?: string
          submission_date?: string
          wps_file_name: string
          wps_file_path?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          error_details?: Json | null
          id?: string
          molhri_response?: Json | null
          payroll_run_id?: string
          status?: string
          submission_date?: string
          wps_file_name?: string
          wps_file_path?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      cci_answers_v1: {
        Row: {
          adj_value: number | null
          department_id: string | null
          grade_id: string | null
          is_flagged: boolean | null
          item_id: string | null
          project_id: string | null
          raw_value: number | null
          reverse_scored: boolean | null
          scale_max: number | null
          scale_min: number | null
          survey_id: string | null
          tenant_id: string | null
          wave_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cci_responses_wave_fk"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_response_quality_v1"
            referencedColumns: ["wave_id"]
          },
          {
            foreignKeyName: "cci_responses_wave_fk"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_response_quality_v1: {
        Row: {
          avg_duration_seconds: number | null
          flagged_percentage: number | null
          flagged_responses: number | null
          survey_id: string | null
          too_fast_responses: number | null
          total_responses: number | null
          wave_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      cci_scores_public_v1: {
        Row: {
          balance_score: number | null
          barrett: Json | null
          cvf: Json | null
          last_computed_at: string | null
          n: number | null
          psych_safety: number | null
          risk_index: number | null
          scope: string | null
          scope_id: string | null
          survey_id: string | null
          tenant_id: string | null
          wave_id: string | null
          web: Json | null
        }
        Insert: {
          balance_score?: number | null
          barrett?: Json | null
          cvf?: Json | null
          last_computed_at?: string | null
          n?: number | null
          psych_safety?: number | null
          risk_index?: number | null
          scope?: string | null
          scope_id?: string | null
          survey_id?: string | null
          tenant_id?: string | null
          wave_id?: string | null
          web?: Json | null
        }
        Update: {
          balance_score?: number | null
          barrett?: Json | null
          cvf?: Json | null
          last_computed_at?: string | null
          n?: number | null
          psych_safety?: number | null
          risk_index?: number | null
          scope?: string | null
          scope_id?: string | null
          survey_id?: string | null
          tenant_id?: string | null
          wave_id?: string | null
          web?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cci_scores_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "cci_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cci_scores_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_response_quality_v1"
            referencedColumns: ["wave_id"]
          },
          {
            foreignKeyName: "cci_scores_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "cci_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_overview_v1: {
        Row: {
          cci_balance_score: number | null
          cci_cvf_balance: number | null
          cci_psych_safety: number | null
          cci_risk_index: number | null
          cci_sample_size: number | null
          compliance_iqama_expiring_30d: number | null
          compliance_nitaqat_status: string | null
          compliance_saudization_rate: number | null
          computed_at: string | null
          osi_critical_layers: number | null
          osi_highest_saudi_layer: number | null
          osi_layers_meeting_target: number | null
          osi_management_cost: number | null
          osi_span_outliers: number | null
          osi_total_layers: number | null
          overall_health_status: string | null
          retention_avg_risk: number | null
          retention_employees_at_risk: number | null
          retention_latest_period: string | null
          tenant_id: string | null
        }
        Relationships: []
      }
      employee_national_mix_v1: {
        Row: {
          employee_count: number | null
          label: string | null
          pct: number | null
          tenant_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employees_full_pii: {
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
          employee_number: string | null
          experience_years: number | null
          family_name_ar: string | null
          family_status: string | null
          first_name: string | null
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
          id: string | null
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
          last_name: string | null
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
          employee_number?: string | null
          experience_years?: number | null
          family_name_ar?: string | null
          family_status?: string | null
          first_name?: string | null
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
          id?: string | null
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
          last_name?: string | null
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
          employee_number?: string | null
          experience_years?: number | null
          family_name_ar?: string | null
          family_status?: string | null
          first_name?: string | null
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
          id?: string | null
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
          last_name?: string | null
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
      employees_safe: {
        Row: {
          basic_salary_info: number | null
          company_email: string | null
          company_id: string | null
          created_at: string | null
          department: string | null
          employee_number: string | null
          first_name: string | null
          first_name_ar: string | null
          hire_date: string | null
          id: string | null
          iqama_number_masked: string | null
          is_saudi: boolean | null
          last_name: string | null
          last_name_ar: string | null
          national_id_masked: string | null
          nationality: string | null
          passport_number_masked: string | null
          personal_email_masked: string | null
          phone_masked: string | null
          position: string | null
          position_ar: string | null
          salary_info: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          basic_salary_info?: never
          company_email?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          employee_number?: string | null
          first_name?: string | null
          first_name_ar?: string | null
          hire_date?: string | null
          id?: string | null
          iqama_number_masked?: never
          is_saudi?: boolean | null
          last_name?: string | null
          last_name_ar?: string | null
          national_id_masked?: never
          nationality?: string | null
          passport_number_masked?: never
          personal_email_masked?: never
          phone_masked?: never
          position?: string | null
          position_ar?: string | null
          salary_info?: never
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          basic_salary_info?: never
          company_email?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          employee_number?: string | null
          first_name?: string | null
          first_name_ar?: string | null
          hire_date?: string | null
          id?: string | null
          iqama_number_masked?: never
          is_saudi?: boolean | null
          last_name?: string | null
          last_name_ar?: string | null
          national_id_masked?: never
          nationality?: string | null
          passport_number_masked?: never
          personal_email_masked?: never
          phone_masked?: never
          position?: string | null
          position_ar?: string | null
          salary_info?: never
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
      org_hierarchy_v1: {
        Row: {
          full_name_ar: string | null
          full_name_en: string | null
          id: string | null
          is_saudi: boolean | null
          layer: number | null
          manager_id: string | null
          monthly_salary: number | null
          nationality: string | null
          tenant_id: string | null
        }
        Relationships: []
      }
      osi_layers_by_grade_v1: {
        Row: {
          company_id: string | null
          headcount: number | null
          layer_code: string | null
          layer_order: number | null
          name_ar: string | null
          name_en: string | null
          non_saudi_hc: number | null
          saudi_hc: number | null
          saudization_rate: number | null
          target_rate: number | null
        }
        Relationships: []
      }
      osi_layers_mv_v1: {
        Row: {
          avg_salary: number | null
          headcount: number | null
          layer: number | null
          saudi_headcount: number | null
          saudization_rate: number | null
          tenant_id: string | null
          total_salary: number | null
        }
        Relationships: []
      }
      osi_span_v1: {
        Row: {
          direct_reports: number | null
          full_name_ar: string | null
          full_name_en: string | null
          layer: number | null
          manager_id: string | null
          tenant_id: string | null
        }
        Relationships: []
      }
      retention_overview_v1: {
        Row: {
          avg_risk: number | null
          department_id: string | null
          dept_name_ar: string | null
          dept_name_en: string | null
          n: number | null
          pct_high: number | null
          period_month: string | null
          tenant_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employees_dept_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_coverage_report: {
        Row: {
          metric_name: string | null
          metric_value: number | null
        }
        Relationships: []
      }
      security_definer_documentation: {
        Row: {
          critical_note: string | null
          documented_functions: number | null
          explanation: string | null
          status: string | null
          summary: string | null
        }
        Relationships: []
      }
      security_definer_status: {
        Row: {
          analysis_type: string | null
          documented_exceptions: number | null
          status: string | null
          summary: string | null
        }
        Relationships: []
      }
      security_definer_status_summary: {
        Row: {
          compliance_notes: string | null
          component_type: string | null
          documented_functions: number | null
          linter_status: string | null
          security_status: string | null
        }
        Relationships: []
      }
      security_function_registry: {
        Row: {
          approved_by: string | null
          documented_date: string | null
          function_name: string | null
          justification: string | null
          schema_name: string | null
        }
        Insert: {
          approved_by?: string | null
          documented_date?: string | null
          function_name?: string | null
          justification?: string | null
          schema_name?: string | null
        }
        Update: {
          approved_by?: string | null
          documented_date?: string | null
          function_name?: string | null
          justification?: string | null
          schema_name?: string | null
        }
        Relationships: []
      }
      security_linter_false_positives: {
        Row: {
          approved_by: string | null
          created_at: string | null
          function_name: string | null
          justification: string | null
          reviewed_by: string | null
          schema_name: string | null
          security_review_date: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          function_name?: string | null
          justification?: string | null
          reviewed_by?: string | null
          schema_name?: string | null
          security_review_date?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          function_name?: string | null
          justification?: string | null
          reviewed_by?: string | null
          schema_name?: string | null
          security_review_date?: string | null
        }
        Relationships: []
      }
      security_summary_report: {
        Row: {
          category: string | null
          count: number | null
          status: string | null
        }
        Relationships: []
      }
      supabase_linter_false_positive_explanation: {
        Row: {
          actual_status: string | null
          business_justification: string | null
          error_name: string | null
          issue_category: string | null
          linter_severity: string | null
          resolution_status: string | null
          root_cause: string | null
          technical_constraint: string | null
        }
        Relationships: []
      }
      user_profiles_with_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          current_role: string | null
          department: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_active: boolean | null
          language: string | null
          last_name: string | null
          role: string | null
          role_assigned_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_costs: {
        Row: {
          employee_id: string | null
          monthly_cost: number | null
          tenant_id: string | null
        }
        Insert: {
          employee_id?: string | null
          monthly_cost?: never
          tenant_id?: string | null
        }
        Update: {
          employee_id?: string | null
          monthly_cost?: never
          tenant_id?: string | null
        }
        Relationships: []
      }
      v_manager_spans: {
        Row: {
          avg_team_cost: number | null
          full_name_ar: string | null
          full_name_en: string | null
          grade_name: string | null
          manager_id: string | null
          overload: boolean | null
          span: number | null
          target_span: number | null
        }
        Relationships: []
      }
      v_org_current: {
        Row: {
          allowances: number | null
          base_salary: number | null
          department_id: string | null
          department_name_ar: string | null
          department_name_en: string | null
          employee_no: string | null
          employment_status: string | null
          full_name_ar: string | null
          full_name_en: string | null
          gender: string | null
          grade_id: string | null
          grade_name_ar: string | null
          grade_name_en: string | null
          hire_date: string | null
          id: string | null
          is_saudi: boolean | null
          job_id: string | null
          job_title_ar: string | null
          job_title_en: string | null
          manager_id: string | null
          nationality_code: string | null
          tenant_id: string | null
          total_compensation: number | null
        }
        Insert: {
          allowances?: number | null
          base_salary?: number | null
          department_id?: string | null
          department_name_ar?: never
          department_name_en?: never
          employee_no?: string | null
          employment_status?: string | null
          full_name_ar?: string | null
          full_name_en?: string | null
          gender?: string | null
          grade_id?: string | null
          grade_name_ar?: never
          grade_name_en?: never
          hire_date?: string | null
          id?: string | null
          is_saudi?: boolean | null
          job_id?: string | null
          job_title_ar?: never
          job_title_en?: never
          manager_id?: string | null
          nationality_code?: string | null
          tenant_id?: string | null
          total_compensation?: never
        }
        Update: {
          allowances?: number | null
          base_salary?: number | null
          department_id?: string | null
          department_name_ar?: never
          department_name_en?: never
          employee_no?: string | null
          employment_status?: string | null
          full_name_ar?: string | null
          full_name_en?: string | null
          gender?: string | null
          grade_id?: string | null
          grade_name_ar?: never
          grade_name_en?: never
          hire_date?: string | null
          id?: string | null
          is_saudi?: boolean | null
          job_id?: string | null
          job_title_ar?: never
          job_title_en?: never
          manager_id?: string | null
          nationality_code?: string | null
          tenant_id?: string | null
          total_compensation?: never
        }
        Relationships: [
          {
            foreignKeyName: "hr_employees_dept_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "hr_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "hr_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "osi_span_v1"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_costs"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_manager_spans"
            referencedColumns: ["manager_id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_org_current"
            referencedColumns: ["id"]
          },
        ]
      }
      v_org_layers: {
        Row: {
          company_id: string | null
          full_name_en: string | null
          id: string | null
          layer: number | null
          manager_id: string | null
          path: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_translation_patch: {
        Args: {
          p_confidence?: number
          p_key: string
          p_language: string
          p_text: string
        }
        Returns: string
      }
      auto_classify_employee_gosi: {
        Args: { p_employee_id: string }
        Returns: undefined
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_annual_leave_entitlement: {
        Args: { p_current_date?: string; p_hire_date: string }
        Returns: number
      }
      calculate_gosi_rates: {
        Args: { p_as_of_date?: string; p_employee_id: string }
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
          p_break_duration?: number
          p_check_in: string
          p_check_out: string
        }
        Returns: number
      }
      can_access_employee_pii: {
        Args: { employee_id?: string }
        Returns: boolean
      }
      cci_norm_0_100: {
        Args: { maxv: number; minv: number; val: number }
        Returns: number
      }
      cosine_similarity: {
        Args: { a: number[]; b: number[] }
        Returns: number
      }
      get_activities_by_sector: {
        Args: { sector_code: string }
        Returns: {
          classification_code: string
          id: string
          name_ar: string
          name_en: string
        }[]
      }
      get_cities_by_region: {
        Args: { region_code: string }
        Returns: {
          code: string
          id: string
          name_ar: string
          name_en: string
          timezone: string
        }[]
      }
      get_current_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_employee_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_government_portals_status: {
        Args: { p_company_id: string }
        Returns: {
          category: string
          compliance_count: number
          connection_status: string
          last_sync_at: string
          portal_code: string
          portal_name_ar: string
          portal_name_en: string
        }[]
      }
      get_user_locale: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      initialize_company_gov_portals: {
        Args: { p_company_id: string }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_hr_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      user_has_role: {
        Args: { _role: string }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "hr_manager" | "employee" | "viewer" | "super_admin"
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
      app_role: ["admin", "hr_manager", "employee", "viewer", "super_admin"],
    },
  },
} as const
