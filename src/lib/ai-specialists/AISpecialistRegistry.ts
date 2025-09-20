import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

export interface AISpecialistCapability {
  id: string;
  name: string;
  description: string;
  aiModels: string[];
  dataTypes: string[];
  analysisTypes: string[];
  webSources: string[];
}

export interface AISpecialist {
  id: string;
  name: string;
  module: string;
  avatar?: string;
  description: string;
  capabilities: AISpecialistCapability[];
  aiTools: string[];
  expertise: string[];
  language: 'ar' | 'en' | 'both';
  status: 'active' | 'learning' | 'offline';
  lastUpdated: string;
}

export class AISpecialistRegistry {
  private specialists: Map<string, AISpecialist> = new Map();

  constructor() {
    this.initializeSpecialists();
  }

  private initializeSpecialists() {
    const specialists: AISpecialist[] = [
      {
        id: 'hr-core-specialist',
        name: 'Dr. Sara Al-Rashid',
        module: 'core-hr',
        description: 'متخصصة في إدارة الموارد البشرية والامتثال السعودي',
        capabilities: [
          {
            id: 'employee-analytics',
            name: 'تحليل الموظفين',
            description: 'تحليل شامل لبيانات الموظفين والأداء',
            aiModels: ['gpt-5', 'claude-opus-4'],
            dataTypes: ['employee_data', 'performance_metrics', 'attendance'],
            analysisTypes: ['predictive', 'descriptive', 'prescriptive'],
            webSources: ['hrsd.gov.sa', 'gosi.gov.sa', 'mol.gov.sa']
          },
          {
            id: 'saudization-optimizer',
            name: 'محسن السعودة',
            description: 'تحسين نسب السعودة والامتثال لبرنامج نطاقات',
            aiModels: ['gpt-5', 'claude-sonnet-4'],
            dataTypes: ['nationality_data', 'hiring_patterns', 'nitaqat_requirements'],
            analysisTypes: ['compliance_analysis', 'gap_analysis', 'strategy_optimization'],
            webSources: ['nitaqat.sa', 'hrsd.gov.sa', 'vision2030.gov.sa']
          }
        ],
        aiTools: ['enhanced-aqlhr-ai', 'ai-agent-orchestrator', 'hr-core-engine'],
        expertise: ['Saudi Labor Law', 'Nitaqat Compliance', 'Performance Management', 'Employee Analytics'],
        language: 'both',
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'payroll-specialist',
        name: 'Ahmad Al-Mahmoud',
        module: 'payroll',
        description: 'خبير في إدارة الرواتب والمزايا والامتثال المالي',
        capabilities: [
          {
            id: 'payroll-compliance',
            name: 'امتثال الرواتب',
            description: 'ضمان امتثال الرواتب للقوانين السعودية',
            aiModels: ['gpt-5', 'claude-opus-4'],
            dataTypes: ['salary_data', 'gosi_rates', 'tax_regulations'],
            analysisTypes: ['compliance_check', 'cost_analysis', 'risk_assessment'],
            webSources: ['gosi.gov.sa', 'zatca.gov.sa', 'sama.gov.sa']
          },
          {
            id: 'compensation-analytics',
            name: 'تحليل التعويضات',
            description: 'تحليل هياكل الرواتب والمزايا',
            aiModels: ['gpt-5-mini', 'claude-sonnet-4'],
            dataTypes: ['compensation_benchmarks', 'market_rates', 'benefit_costs'],
            analysisTypes: ['market_analysis', 'equity_analysis', 'cost_optimization'],
            webSources: ['gulf-talent.com', 'bayt.com', 'linkedin.com/salary']
          }
        ],
        aiTools: ['enhanced-aqlhr-ai', 'ai-document-processor', 'integration-gateway'],
        expertise: ['Payroll Systems', 'GOSI Compliance', 'Tax Regulations', 'Compensation Analysis'],
        language: 'both',
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'recruitment-specialist',
        name: 'Fatima Al-Zahra',
        module: 'recruitment',
        description: 'متخصصة في التوظيف والاختيار والجذب الذكي للمواهب',
        capabilities: [
          {
            id: 'talent-sourcing',
            name: 'البحث عن المواهب',
            description: 'البحث الذكي عن المواهب السعودية والدولية',
            aiModels: ['gpt-5', 'claude-opus-4'],
            dataTypes: ['job_market_data', 'candidate_profiles', 'skill_requirements'],
            analysisTypes: ['talent_mapping', 'skill_gap_analysis', 'market_intelligence'],
            webSources: ['linkedin.com', 'bayt.com', 'tanqeeb.com', 'mihnati.sa']
          },
          {
            id: 'cv-screening',
            name: 'فحص السير الذاتية',
            description: 'فحص وتحليل السير الذاتية بالذكاء الاصطناعي',
            aiModels: ['gpt-5-mini', 'claude-3-5-haiku'],
            dataTypes: ['cv_data', 'job_descriptions', 'qualification_matrices'],
            analysisTypes: ['matching_analysis', 'qualification_assessment', 'bias_detection'],
            webSources: ['indeed.com', 'glassdoor.com', 'wuzzuf.net']
          }
        ],
        aiTools: ['hf-document-processor', 'ai-document-intelligence', 'enhanced-ai-sync-engine'],
        expertise: ['Talent Acquisition', 'AI Screening', 'Saudization Strategies', 'Market Intelligence'],
        language: 'both',
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'performance-specialist',
        name: 'Dr. Omar Al-Harbi',
        module: 'performance',
        description: 'خبير في إدارة الأداء والتطوير المهني',
        capabilities: [
          {
            id: 'performance-analytics',
            name: 'تحليل الأداء',
            description: 'تحليل شامل لأداء الموظفين والفرق',
            aiModels: ['gpt-5', 'o3-2025-04-16'],
            dataTypes: ['performance_reviews', 'kpi_data', 'goal_tracking'],
            analysisTypes: ['trend_analysis', 'predictive_modeling', 'improvement_recommendations'],
            webSources: ['harvard.edu/performance', 'mckinsey.com', 'deloitte.com']
          },
          {
            id: 'learning-path-optimizer',
            name: 'محسن مسارات التعلم',
            description: 'تحسين مسارات التطوير والتدريب للموظفين',
            aiModels: ['claude-opus-4', 'gpt-5-mini'],
            dataTypes: ['skill_assessments', 'learning_records', 'career_paths'],
            analysisTypes: ['skill_gap_analysis', 'learning_recommendations', 'career_planning'],
            webSources: ['coursera.org', 'linkedin.com/learning', 'udemy.com']
          }
        ],
        aiTools: ['ai-prompt-driven-executor', 'agent-skill-executor', 'ai-core-engine'],
        expertise: ['Performance Management', 'Learning & Development', 'Career Planning', 'Skills Assessment'],
        language: 'both',
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'compliance-specialist',
        name: 'Maryam Al-Otaibi',
        module: 'compliance',
        description: 'متخصصة في الامتثال والقوانين السعودية',
        capabilities: [
          {
            id: 'regulatory-monitoring',
            name: 'مراقبة الامتثال',
            description: 'مراقبة مستمرة للوائح والقوانين الجديدة',
            aiModels: ['gpt-5', 'claude-opus-4'],
            dataTypes: ['legal_updates', 'policy_changes', 'compliance_metrics'],
            analysisTypes: ['regulatory_impact_analysis', 'compliance_gap_assessment', 'risk_monitoring'],
            webSources: ['boe.gov.sa', 'mc.gov.sa', 'moj.gov.sa', 'sama.gov.sa']
          },
          {
            id: 'policy-generator',
            name: 'مولد السياسات',
            description: 'إنشاء سياسات HR متوافقة مع القوانين السعودية',
            aiModels: ['gpt-5', 'claude-sonnet-4'],
            dataTypes: ['legal_frameworks', 'industry_standards', 'best_practices'],
            analysisTypes: ['policy_creation', 'legal_alignment', 'risk_mitigation'],
            webSources: ['vision2030.gov.sa', 'nca.gov.sa', 'citc.gov.sa']
          }
        ],
        aiTools: ['saudi-document-processor', 'enhanced-aqlhr-ai', 'integration-gateway'],
        expertise: ['Saudi Labor Law', 'Data Protection (PDPL)', 'Corporate Governance', 'Risk Management'],
        language: 'both',
        status: 'active',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'analytics-specialist',
        name: 'Dr. Khalid Al-Dosari',
        module: 'analytics',
        description: 'خبير في تحليلات الموارد البشرية والذكاء الاصطناعي',
        capabilities: [
          {
            id: 'predictive-analytics',
            name: 'التحليلات التنبؤية',
            description: 'نمذجة تنبؤية لاتجاهات الموارد البشرية',
            aiModels: ['o3-2025-04-16', 'gpt-5', 'claude-opus-4'],
            dataTypes: ['historical_hr_data', 'market_trends', 'economic_indicators'],
            analysisTypes: ['turnover_prediction', 'demand_forecasting', 'trend_analysis'],
            webSources: ['stats.gov.sa', 'worldbank.org', 'imf.org', 'mckinsey.com']
          },
          {
            id: 'workforce-insights',
            name: 'رؤى القوى العاملة',
            description: 'تحليل عميق لديناميكيات القوى العاملة',
            aiModels: ['gpt-5', 'claude-sonnet-4'],
            dataTypes: ['workforce_demographics', 'engagement_surveys', 'productivity_metrics'],
            analysisTypes: ['sentiment_analysis', 'engagement_modeling', 'productivity_optimization'],
            webSources: ['gallup.com', 'hranalytics.com', 'workday.com/insights']
          }
        ],
        aiTools: ['ai-core-engine', 'enhanced-ai-sync-engine', 'ai-agent-orchestrator'],
        expertise: ['HR Analytics', 'Machine Learning', 'Data Science', 'Business Intelligence'],
        language: 'both',
        status: 'active',
        lastUpdated: new Date().toISOString()
      }
    ];

    specialists.forEach(specialist => {
      this.specialists.set(specialist.id, specialist);
    });
  }

  async getSpecialist(specialistId: string): Promise<AISpecialist | null> {
    return this.specialists.get(specialistId) || null;
  }

  async getSpecialistsByModule(module: string): Promise<AISpecialist[]> {
    return Array.from(this.specialists.values()).filter(s => s.module === module);
  }

  async getAllSpecialists(): Promise<AISpecialist[]> {
    return Array.from(this.specialists.values());
  }

  async analyzeWithSpecialist(
    specialistId: string, 
    capability: string, 
    data: any
  ): Promise<any> {
    const specialist = await this.getSpecialist(specialistId);
    if (!specialist) {
      throw new Error(`Specialist ${specialistId} not found`);
    }

    const cap = specialist.capabilities.find(c => c.id === capability);
    if (!cap) {
      throw new Error(`Capability ${capability} not found for specialist ${specialistId}`);
    }

    // Call the appropriate AI tool based on specialist's capabilities
    const tenantId = await getTenantIdOrDemo();
    
    const analysisRequest = {
      specialist_id: specialistId,
      capability: capability,
      data: data,
      tenant_id: tenantId,
      ai_models: cap.aiModels,
      web_sources: cap.webSources,
      analysis_types: cap.analysisTypes
    };

    // Use the enhanced AqlHR AI with specialist context
    const { data: result, error } = await supabase.functions.invoke('enhanced-aqlhr-ai', {
      body: {
        query: `Analyze the following data using ${specialist.name}'s expertise in ${cap.name}`,
        context: {
          specialist: specialist,
          capability: cap,
          analysis_data: data,
          language: 'both'
        }
      }
    });

    if (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }

    return result;
  }

  async getLiveWebData(sources: string[], query: string): Promise<any> {
    // Integrate with web scraping and live data sources
    const webData = await Promise.all(
      sources.map(async (source) => {
        try {
          // Use Firecrawl or web scraping to get live data
          const { data, error } = await supabase.functions.invoke('integration-gateway', {
            body: {
              action: 'fetch_web_data',
              source: source,
              query: query
            }
          });

          return { source, data: data || null, error };
        } catch (error) {
          return { source, data: null, error: error.message };
        }
      })
    );

    return webData;
  }

  async updateSpecialistKnowledge(specialistId: string): Promise<void> {
    const specialist = await this.getSpecialist(specialistId);
    if (!specialist) return;

    // Sync with latest web data and update specialist knowledge
    const webSources = specialist.capabilities.flatMap(c => c.webSources);
    const uniqueSources = [...new Set(webSources)];

    for (const source of uniqueSources) {
      try {
        await this.getLiveWebData([source], `latest updates for ${specialist.module}`);
      } catch (error) {
        console.error(`Failed to update knowledge from ${source}:`, error);
      }
    }

    // Update specialist's last updated timestamp
    specialist.lastUpdated = new Date().toISOString();
    this.specialists.set(specialistId, specialist);
  }
}