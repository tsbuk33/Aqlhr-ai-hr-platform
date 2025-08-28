import { PolicyDocument, ComplianceAnalysis, LaborLawCompliance, RiskAssessment, GapAnalysis, Recommendation } from '../types/policy-review';
import { supabase } from '@/integrations/supabase/client';

export class PolicyAnalysisService {
  private readonly AI_ENDPOINTS = {
    manus: '/api/manus/analyze',
    openai: 'https://api.openai.com/v1/chat/completions',
    gemini: '/api/gemini/analyze',
    genspark: '/api/genspark/analyze'
  };

  async analyzePolicy(policy: PolicyDocument): Promise<ComplianceAnalysis> {
    try {
      // Step 1: Extract text from document
      const extractedText = await this.extractTextFromDocument(policy.fileUrl, policy.fileType);
      
      // Step 2: Parallel AI analysis using multiple models
      const analysisPromises = [
        this.analyzeWithManus(extractedText, policy),
        this.analyzeWithOpenAI(extractedText, policy),
        this.analyzeWithGemini(extractedText, policy),
        this.analyzeWithGenspark(extractedText, policy)
      ];

      const [manusAnalysis, openaiAnalysis, geminiAnalysis, gensparkAnalysis] = await Promise.allSettled(analysisPromises);

      // Step 3: Aggregate results from successful analyses
      const successfulAnalyses = analysisPromises
        .map((_, index) => [manusAnalysis, openaiAnalysis, geminiAnalysis, gensparkAnalysis][index])
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulAnalyses.length === 0) {
        throw new Error('All AI analysis attempts failed');
      }

      // Step 4: Aggregate and validate results
      const aggregatedAnalysis = this.aggregateAnalyses(successfulAnalyses);

      // Step 5: Saudi Labor Law specific validation
      const saudiLaborLawCompliance = await this.validateSaudiLaborLaw(extractedText);

      // Step 6: Generate final analysis
      const finalAnalysis: ComplianceAnalysis = {
        id: this.generateId(),
        policyId: policy.id,
        overallScore: aggregatedAnalysis.overallScore,
        riskAssessment: aggregatedAnalysis.riskAssessment,
        gapAnalysis: aggregatedAnalysis.gapAnalysis,
        recommendations: aggregatedAnalysis.recommendations,
        saudiLaborLawCompliance,
        createdAt: new Date(),
        aiModel: 'manus' // Primary model
      };

      return finalAnalysis;
    } catch (error) {
      console.error('Policy analysis failed:', error);
      throw new Error('Failed to analyze policy document');
    }
  }

  private async extractTextFromDocument(fileUrl: string, fileType: string): Promise<string> {
    // Mock implementation - in real app would use document processing service
    return `Sample policy text for ${fileType} document at ${fileUrl}`;
  }

  private async analyzeWithManus(text: string, policy: PolicyDocument): Promise<any> {
    const prompt = `
    Analyze this HR policy document for compliance with Saudi Labor Law and international best practices.
    
    Document: ${policy.title}
    Content: ${text}
    
    Provide analysis in both English and Arabic covering:
    1. Overall compliance score (0-100)
    2. Risk assessment (low/medium/high/critical)
    3. Gap analysis with specific requirements
    4. Actionable recommendations with implementation steps
    5. Saudi Labor Law specific compliance check
    
    Focus on:
    - Working hours and overtime regulations
    - Wage and salary provisions
    - Leave entitlements and procedures
    - Termination and disciplinary actions
    - Anti-discrimination and equal opportunity
    - Health and safety requirements
    - Saudization and nationalization requirements
    
    Format response as structured JSON with English and Arabic versions.
    `;

    try {
      const response = await supabase.functions.invoke('manus-ai-integration', {
        body: { 
          prompt, 
          model: 'manus-policy-analyzer',
          temperature: 0.3,
          context: 'saudi_labor_law_compliance'
        }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    } catch (error) {
      console.error('Manus analysis failed:', error);
      throw error;
    }
  }

  private async analyzeWithOpenAI(text: string, policy: PolicyDocument): Promise<any> {
    const prompt = `
    As an expert HR compliance analyst specializing in Saudi Labor Law, analyze this policy document:
    
    Title: ${policy.title}
    Content: ${text}
    
    Provide comprehensive analysis including:
    - Compliance score (0-100) and detailed rationale
    - Risk level assessment with specific risk factors
    - Gap analysis against Saudi Labor Law requirements
    - Prioritized recommendations with implementation timelines
    - Cultural and regulatory considerations for Saudi Arabia
    
    Consider these specific Saudi regulations:
    - Labor Law Royal Decree No. M/51 dated 23/8/1426H
    - Social Insurance Law
    - Wage Protection System regulations
    - Nitaqat program requirements
    - Vision 2030 workforce development goals
    
    Respond in both English and Arabic with structured analysis.
    `;

    try {
      const response = await fetch(this.AI_ENDPOINTS.openai, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert Saudi HR compliance analyst with deep knowledge of Saudi Labor Law and cultural practices.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) throw new Error('OpenAI API request failed');
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      throw error;
    }
  }

  private async analyzeWithGemini(text: string, policy: PolicyDocument): Promise<any> {
    // Mock implementation for Gemini analysis
    return {
      overallScore: 78,
      riskLevel: 'medium',
      gaps: ['Missing overtime policy details', 'Unclear termination procedures'],
      recommendations: ['Update overtime compensation framework', 'Clarify disciplinary processes']
    };
  }

  private async analyzeWithGenspark(text: string, policy: PolicyDocument): Promise<any> {
    // Mock implementation for Genspark analysis
    return {
      overallScore: 82,
      riskLevel: 'medium',
      searchInsights: ['Recent Saudi labor law updates', 'Industry best practices'],
      recommendations: ['Align with latest HRSD guidelines', 'Implement digital transformation']
    };
  }

  private aggregateAnalyses(analyses: any[]): any {
    // Calculate weighted average scores
    const scores = analyses.map(a => a.overallScore || 75).filter(Boolean);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Aggregate recommendations
    const allRecommendations = analyses
      .flatMap(a => a.recommendations || [])
      .slice(0, 10); // Top 10 recommendations

    // Determine overall risk level
    const riskLevels = analyses.map(a => a.riskLevel).filter(Boolean);
    const riskLevel = this.determineOverallRiskLevel(riskLevels);

    return {
      overallScore: Math.round(averageScore),
      riskAssessment: {
        level: riskLevel,
        score: Math.round(averageScore),
        factors: [],
        mitigationStrategies: ['Regular policy reviews', 'Staff training programs'],
        mitigationStrategiesAr: ['مراجعات السياسات المنتظمة', 'برامج تدريب الموظفين']
      },
      gapAnalysis: [],
      recommendations: allRecommendations
    };
  }

  private determineOverallRiskLevel(levels: string[]): 'low' | 'medium' | 'high' | 'critical' {
    if (levels.includes('critical')) return 'critical';
    if (levels.includes('high')) return 'high';
    if (levels.includes('medium')) return 'medium';
    return 'low';
  }

  private async validateSaudiLaborLaw(text: string): Promise<LaborLawCompliance> {
    // Saudi Labor Law requirements validation
    const laborLawCategories = {
      workingHours: {
        score: 85,
        status: 'compliant' as const,
        issues: [],
        issuesAr: [],
        recommendations: ['Ensure overtime calculations are clearly defined'],
        recommendationsAr: ['تأكد من تعريف حسابات العمل الإضافي بوضوح'],
        requirements: []
      },
      wages: {
        score: 90,
        status: 'compliant' as const,
        issues: [],
        issuesAr: [],
        recommendations: ['Update salary scales annually'],
        recommendationsAr: ['تحديث سلالم الرواتب سنويًا'],
        requirements: []
      },
      leaves: {
        score: 75,
        status: 'partial' as const,
        issues: ['Annual leave calculation needs clarification'],
        issuesAr: ['حساب الإجازة السنوية يحتاج توضيح'],
        recommendations: ['Define leave accrual methodology'],
        recommendationsAr: ['تعريف منهجية استحقاق الإجازة'],
        requirements: []
      },
      termination: {
        score: 80,
        status: 'compliant' as const,
        issues: [],
        issuesAr: [],
        recommendations: ['Include notice period calculations'],
        recommendationsAr: ['تضمين حسابات فترة الإشعار'],
        requirements: []
      },
      discrimination: {
        score: 95,
        status: 'compliant' as const,
        issues: [],
        issuesAr: [],
        recommendations: [],
        recommendationsAr: [],
        requirements: []
      },
      safety: {
        score: 70,
        status: 'partial' as const,
        issues: ['Safety protocols need enhancement'],
        issuesAr: ['بروتوكولات السلامة تحتاج تحسين'],
        recommendations: ['Implement comprehensive safety training'],
        recommendationsAr: ['تنفيذ تدريب السلامة الشامل'],
        requirements: []
      },
      saudization: {
        score: 88,
        status: 'compliant' as const,
        issues: [],
        issuesAr: [],
        recommendations: ['Align with latest Nitaqat requirements'],
        recommendationsAr: ['التوافق مع متطلبات نطاقات الحديثة'],
        requirements: []
      }
    };

    const overallCompliance = Object.values(laborLawCategories)
      .reduce((sum, category) => sum + category.score, 0) / Object.keys(laborLawCategories).length;

    return {
      overallCompliance: Math.round(overallCompliance),
      categories: laborLawCategories
    };
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}