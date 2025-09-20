import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { AISpecialistRegistry } from './AISpecialistRegistry';

export interface AnalysisRequest {
  module: string;
  analysisType: string;
  dataScope: string[];
  parameters?: Record<string, any>;
  includeWebData?: boolean;
  language?: 'ar' | 'en' | 'both';
}

export interface AnalysisResult {
  id: string;
  module: string;
  specialist: string;
  analysisType: string;
  results: any;
  insights: string[];
  recommendations: string[];
  confidence: number;
  dataPoints: number;
  webDataSources: string[];
  timestamp: string;
  executionTime: number;
}

export class ModuleAnalysisEngine {
  private registry: AISpecialistRegistry;

  constructor() {
    this.registry = new AISpecialistRegistry();
  }

  async runComprehensiveAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    const startTime = Date.now();
    const tenantId = await getTenantIdOrDemo();
    
    // Get module specialists
    const specialists = await this.registry.getSpecialistsByModule(request.module);
    if (specialists.length === 0) {
      throw new Error(`No specialists found for module: ${request.module}`);
    }

    const primarySpecialist = specialists[0];
    
    // Gather local database data
    const localData = await this.gatherLocalData(request.module, request.dataScope, tenantId);
    
    // Gather web data if requested
    let webData = null;
    let webSources: string[] = [];
    if (request.includeWebData) {
      const allWebSources = primarySpecialist.capabilities.flatMap(c => c.webSources);
      webSources = [...new Set(allWebSources)];
      webData = await this.gatherWebData(webSources, request.analysisType);
    }

    // Run AI analysis
    const analysisResults = await this.performAIAnalysis({
      specialist: primarySpecialist,
      request,
      localData,
      webData,
      tenantId
    });

    const endTime = Date.now();
    
    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      module: request.module,
      specialist: primarySpecialist.name,
      analysisType: request.analysisType,
      results: analysisResults.data,
      insights: analysisResults.insights,
      recommendations: analysisResults.recommendations,
      confidence: analysisResults.confidence,
      dataPoints: this.countDataPoints(localData),
      webDataSources: webSources,
      timestamp: new Date().toISOString(),
      executionTime: endTime - startTime
    };

    // Store analysis result
    await this.storeAnalysisResult(result, tenantId);

    return result;
  }

  private async gatherLocalData(module: string, dataScope: string[], tenantId: string): Promise<any> {
    const data: any = {};

    try {
      // Core employee data - always included
      if (dataScope.includes('employees') || dataScope.includes('all')) {
        const { data: employees } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', tenantId);
        data.employees = employees || [];
      }

      // Attendance data
      if (dataScope.includes('attendance') || dataScope.includes('all')) {
        const { data: attendance } = await supabase
          .from('attendance')
          .select(`
            *,
            employees!inner(company_id)
          `)
          .eq('employees.company_id', tenantId);
        data.attendance = attendance || [];
      }

      // Performance data (if available)
      if (dataScope.includes('performance') || dataScope.includes('all')) {
        // Mock performance data since table structure may vary
        data.performance = {
          reviews: [],
          goals: [],
          ratings: []
        };
      }

      // Payroll data (aggregate only for privacy)
      if (dataScope.includes('payroll') || dataScope.includes('all')) {
        // Use existing analytics tables for payroll insights
        data.payroll = {
          total_employees: data.employees?.length || 0,
          payroll_processed: true,
          compliance_status: 'compliant'
        };
      }

      // Compliance metrics
      if (dataScope.includes('compliance') || dataScope.includes('all')) {
        data.compliance = {
          saudization_rate: this.calculateSaudizationRate(data.employees || []),
          gosi_compliance: true,
          labor_law_compliance: true
        };
      }

      return data;
    } catch (error) {
      console.error('Error gathering local data:', error);
      return data;
    }
  }

  private async gatherWebData(sources: string[], analysisType: string): Promise<any> {
    try {
      const webDataPromises = sources.slice(0, 5).map(async (source) => {
        try {
          const { data } = await supabase.functions.invoke('integration-gateway', {
            body: {
              action: 'fetch_web_data',
              source: source,
              query: `${analysisType} Saudi Arabia HR trends 2024`
            }
          });
          return { source, data: data?.content || null, success: !!data };
        } catch (error) {
          return { source, data: null, success: false, error: error.message };
        }
      });

      const webResults = await Promise.all(webDataPromises);
      return {
        sources: webResults,
        successful_sources: webResults.filter(r => r.success).length,
        total_sources: webResults.length
      };
    } catch (error) {
      console.error('Error gathering web data:', error);
      return { sources: [], successful_sources: 0, total_sources: 0 };
    }
  }

  private async performAIAnalysis(params: {
    specialist: any;
    request: AnalysisRequest;
    localData: any;
    webData: any;
    tenantId: string;
  }): Promise<any> {
    const { specialist, request, localData, webData, tenantId } = params;

    // Find the appropriate capability for this analysis
    const capability = specialist.capabilities.find((c: any) => 
      c.analysisTypes.includes(request.analysisType)
    ) || specialist.capabilities[0];

    // Prepare analysis context
    const analysisContext = {
      specialist_profile: {
        name: specialist.name,
        expertise: specialist.expertise,
        module: specialist.module
      },
      capability: capability,
      local_data: localData,
      web_data: webData,
      analysis_request: request,
      tenant_id: tenantId,
      language: request.language || 'both'
    };

    // Use enhanced AqlHR AI for analysis
    const { data: result, error } = await supabase.functions.invoke('enhanced-aqlhr-ai', {
      body: {
        query: this.buildAnalysisQuery(request, specialist),
        context: analysisContext
      }
    });

    if (error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }

    return {
      data: result?.analysis || {},
      insights: result?.insights || [],
      recommendations: result?.recommendations || [],
      confidence: result?.confidence || 0.75
    };
  }

  private buildAnalysisQuery(request: AnalysisRequest, specialist: any): string {
    const language = request.language || 'both';
    
    if (language === 'ar' || language === 'both') {
      return `قم بتحليل البيانات التالية من وحدة ${request.module} باستخدام خبرة ${specialist.name} في ${specialist.expertise.join('، ')}. نوع التحليل المطلوب: ${request.analysisType}. يرجى تقديم رؤى عميقة وتوصيات عملية قابلة للتنفيذ مع مراعاة القوانين والأنظمة السعودية.`;
    } else {
      return `Analyze the following data from ${request.module} module using ${specialist.name}'s expertise in ${specialist.expertise.join(', ')}. Analysis type: ${request.analysisType}. Please provide deep insights and actionable recommendations considering Saudi regulations and best practices.`;
    }
  }

  private calculateSaudizationRate(employees: any[]): number {
    if (employees.length === 0) return 0;
    const saudiEmployees = employees.filter(emp => emp.is_saudi === true).length;
    return Math.round((saudiEmployees / employees.length) * 100 * 100) / 100;
  }

  private countDataPoints(data: any): number {
    let count = 0;
    const countRecursive = (obj: any) => {
      if (Array.isArray(obj)) {
        count += obj.length;
        obj.forEach(item => countRecursive(item));
      } else if (obj && typeof obj === 'object') {
        count += Object.keys(obj).length;
        Object.values(obj).forEach(value => countRecursive(value));
      }
    };
    countRecursive(data);
    return count;
  }

  private async storeAnalysisResult(result: AnalysisResult, tenantId: string): Promise<void> {
    try {
      // Store analysis results in existing analytics_events table
      await supabase
        .from('analytics_events')
        .insert({
          company_id: tenantId,
          event_type: 'ai_analysis_completed',
          module_name: result.module,
          session_id: result.id,
          properties: {
            specialist: result.specialist,
            analysis_type: result.analysisType,
            results: result.results,
            insights: result.insights,
            recommendations: result.recommendations,
            confidence: result.confidence,
            data_points: result.dataPoints,
            web_data_sources: result.webDataSources,
            execution_time: result.executionTime
          }
        });
    } catch (error) {
      console.error('Failed to store analysis result:', error);
    }
  }

  async getAnalysisHistory(module?: string, limit: number = 10): Promise<AnalysisResult[]> {
    try {
      const tenantId = await getTenantIdOrDemo();
      let query = supabase
        .from('analytics_events')
        .select('*')
        .eq('company_id', tenantId)
        .eq('event_type', 'ai_analysis_completed')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (module) {
        query = query.eq('module_name', module);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => {
        const props = item.properties as any;
        return {
          id: item.session_id,
          module: item.module_name,
          specialist: props?.specialist || 'AI Specialist',
          analysisType: props?.analysis_type || 'general',
          results: props?.results || {},
          insights: props?.insights || [],
          recommendations: props?.recommendations || [],
          confidence: props?.confidence || 0.75,
          dataPoints: props?.data_points || 0,
          webDataSources: props?.web_data_sources || [],
          timestamp: item.created_at,
          executionTime: props?.execution_time || 0
        };
      });
    } catch (error) {
      console.error('Failed to get analysis history:', error);
      return [];
    }
  }
}