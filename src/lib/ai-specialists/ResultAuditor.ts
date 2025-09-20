import { ModuleType } from './QueryGatekeeper';
import { ExecutionPlan, PlanStep } from './QueryPlanner';

export interface AuditResult {
  id: string;
  stepId: string;
  tool: string;
  module: ModuleType;
  qualityScore: number; // 0-100
  consistencyScore: number; // 0-100
  accuracyScore: number; // 0-100
  overallScore: number; // 0-100
  issues: AuditIssue[];
  recommendations: string[];
  needsReplanning: boolean;
  confidence: number;
  auditedAt: Date;
  auditor: string;
}

export interface AuditIssue {
  type: 'quality' | 'consistency' | 'accuracy' | 'completeness' | 'logic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedData: string[];
  suggestedFix: string;
  relatedSteps?: string[];
}

export interface CrossModuleValidation {
  modules: ModuleType[];
  metrics: string[];
  expectedConsistency: number;
  actualConsistency: number;
  contradictions: string[];
  resolutionStrategy: string;
}

export interface AuditorSpecialist {
  id: string;
  name: string;
  modules: ModuleType[];
  expertise: string[];
  qualityThresholds: Record<string, number>;
  auditCapabilities: string[];
}

export class ResultAuditor {
  private static instance: ResultAuditor;
  
  private readonly QUALITY_THRESHOLD = 75;
  private readonly CONSISTENCY_THRESHOLD = 80;
  private readonly ACCURACY_THRESHOLD = 70;
  private readonly OVERALL_THRESHOLD = 75;

  // Auditor specialists for different modules
  private readonly AUDITOR_SPECIALISTS: AuditorSpecialist[] = [
    {
      id: 'hr-data-auditor',
      name: 'Dr. Nora Al-Harthy',
      modules: ['employees', 'recruitment'],
      expertise: ['Data Validation', 'HR Metrics', 'Statistical Analysis'],
      qualityThresholds: {
        data_completeness: 90,
        metric_accuracy: 85,
        logic_consistency: 80
      },
      auditCapabilities: ['data_validation', 'statistical_analysis', 'trend_verification']
    },
    {
      id: 'compliance-auditor',
      name: 'Ahmad Al-Qasemi',
      modules: ['compliance', 'documents'],
      expertise: ['Legal Compliance', 'Policy Validation', 'Regulatory Analysis'],
      qualityThresholds: {
        legal_accuracy: 95,
        policy_alignment: 90,
        regulatory_compliance: 95
      },
      auditCapabilities: ['legal_validation', 'policy_checking', 'regulatory_compliance']
    },
    {
      id: 'financial-auditor',
      name: 'Fatima Al-Zahra',
      modules: ['payroll', 'analytics'],
      expertise: ['Financial Analysis', 'Calculation Verification', 'Cost Analysis'],
      qualityThresholds: {
        calculation_accuracy: 99,
        financial_logic: 95,
        cost_consistency: 90
      },
      auditCapabilities: ['calculation_verification', 'financial_analysis', 'cost_validation']
    },
    {
      id: 'performance-auditor',
      name: 'Dr. Khalid Al-Rashid',
      modules: ['performance', 'training', 'attendance'],
      expertise: ['Performance Metrics', 'KPI Validation', 'Behavioral Analysis'],
      qualityThresholds: {
        metric_validity: 85,
        performance_logic: 80,
        trend_consistency: 75
      },
      auditCapabilities: ['performance_validation', 'kpi_verification', 'trend_analysis']
    }
  ];

  // Quality criteria for different data types
  private readonly QUALITY_CRITERIA: Record<string, {
    completeness: (data: any) => number;
    accuracy: (data: any, context?: any) => number;
    consistency: (data: any, previousResults?: any[]) => number;
  }> = {
    employee_data: {
      completeness: (data) => {
        const requiredFields = ['total_active', 'saudization_rate', 'departments'];
        const presentFields = requiredFields.filter(field => data[field] !== undefined);
        return (presentFields.length / requiredFields.length) * 100;
      },
      accuracy: (data) => {
        let score = 100;
        if (data.saudization_rate < 0 || data.saudization_rate > 100) score -= 20;
        if (data.total_active < 0) score -= 30;
        if (data.saudi_count > data.total_active) score -= 25;
        return Math.max(0, score);
      },
      consistency: (data, previousResults) => {
        if (!previousResults || previousResults.length === 0) return 85;
        const lastResult = previousResults[previousResults.length - 1];
        const headcountDiff = Math.abs(data.total_active - lastResult.total_active);
        const maxExpectedChange = lastResult.total_active * 0.1; // 10% max change
        return headcountDiff <= maxExpectedChange ? 95 : 60;
      }
    },
    payroll_data: {
      completeness: (data) => {
        const requiredFields = ['total_cost', 'employee_count', 'average_salary'];
        const presentFields = requiredFields.filter(field => data[field] !== undefined);
        return (presentFields.length / requiredFields.length) * 100;
      },
      accuracy: (data) => {
        let score = 100;
        if (data.total_cost <= 0) score -= 40;
        if (data.average_salary <= 0) score -= 30;
        if (data.employee_count <= 0) score -= 30;
        return Math.max(0, score);
      },
      consistency: (data, previousResults) => {
        if (!previousResults || previousResults.length === 0) return 85;
        const lastResult = previousResults[previousResults.length - 1];
        const costDiff = Math.abs(data.total_cost - lastResult.total_cost);
        const maxExpectedChange = lastResult.total_cost * 0.15; // 15% max change
        return costDiff <= maxExpectedChange ? 90 : 55;
      }
    },
    document_data: {
      completeness: (data) => {
        const requiredFields = ['documents', 'count', 'categories'];
        const presentFields = requiredFields.filter(field => data[field] !== undefined);
        return (presentFields.length / requiredFields.length) * 100;
      },
      accuracy: (data) => {
        let score = 100;
        if (!Array.isArray(data.documents)) score -= 30;
        if (data.count < 0) score -= 25;
        if (data.documents && data.count !== data.documents.length) score -= 20;
        return Math.max(0, score);
      },
      consistency: (data, previousResults) => {
        return 80; // Documents can vary significantly
      }
    }
  };

  public static getInstance(): ResultAuditor {
    if (!ResultAuditor.instance) {
      ResultAuditor.instance = new ResultAuditor();
    }
    return ResultAuditor.instance;
  }

  public async auditExecutionPlan(plan: ExecutionPlan): Promise<{
    auditResults: AuditResult[];
    overallQuality: number;
    needsReplanning: boolean;
    crossModuleValidations: CrossModuleValidation[];
    recommendations: string[];
  }> {
    const auditResults: AuditResult[] = [];
    const crossModuleValidations: CrossModuleValidation[] = [];

    // Audit each completed step
    for (const step of plan.steps.filter(s => s.status === 'completed' && s.result)) {
      const auditResult = await this.auditStepResult(step, plan);
      auditResults.push(auditResult);
    }

    // Perform cross-module validation
    const moduleResults = this.groupResultsByModule(auditResults);
    for (const [module1, results1] of Object.entries(moduleResults)) {
      for (const [module2, results2] of Object.entries(moduleResults)) {
        if (module1 !== module2) {
          const validation = this.validateCrossModuleConsistency(
            module1 as ModuleType, 
            results1, 
            module2 as ModuleType, 
            results2
          );
          if (validation.contradictions.length > 0) {
            crossModuleValidations.push(validation);
          }
        }
      }
    }

    // Calculate overall quality
    const overallQuality = auditResults.length > 0 
      ? auditResults.reduce((sum, audit) => sum + audit.overallScore, 0) / auditResults.length
      : 0;

    // Determine if replanning is needed
    const needsReplanning = overallQuality < this.OVERALL_THRESHOLD ||
                           auditResults.some(audit => audit.needsReplanning) ||
                           crossModuleValidations.some(validation => validation.actualConsistency < 60);

    // Generate recommendations
    const recommendations = this.generateRecommendations(auditResults, crossModuleValidations);

    return {
      auditResults,
      overallQuality,
      needsReplanning,
      crossModuleValidations,
      recommendations
    };
  }

  private async auditStepResult(step: PlanStep, plan: ExecutionPlan): Promise<AuditResult> {
    const auditor = this.selectAuditorForModule(step.module);
    const dataType = this.inferDataType(step.tool, step.result);
    
    // Calculate quality scores
    const qualityScore = this.assessQuality(step.result, dataType);
    const consistencyScore = this.assessConsistency(step.result, dataType, plan);
    const accuracyScore = this.assessAccuracy(step.result, dataType, step);
    
    const overallScore = (qualityScore + consistencyScore + accuracyScore) / 3;
    
    // Identify issues
    const issues = this.identifyIssues(step.result, dataType, {
      quality: qualityScore,
      consistency: consistencyScore,
      accuracy: accuracyScore
    });

    // Generate recommendations
    const recommendations = this.generateStepRecommendations(step, issues);

    // Determine if replanning is needed
    const needsReplanning = overallScore < this.OVERALL_THRESHOLD ||
                           issues.some(issue => issue.severity === 'critical');

    return {
      id: `audit_${step.id}_${Date.now()}`,
      stepId: step.id,
      tool: step.tool,
      module: step.module,
      qualityScore,
      consistencyScore,
      accuracyScore,
      overallScore,
      issues,
      recommendations,
      needsReplanning,
      confidence: this.calculateAuditConfidence(overallScore, issues.length),
      auditedAt: new Date(),
      auditor: auditor.name
    };
  }

  private selectAuditorForModule(module: ModuleType): AuditorSpecialist {
    return this.AUDITOR_SPECIALISTS.find(auditor => 
      auditor.modules.includes(module)
    ) || this.AUDITOR_SPECIALISTS[0];
  }

  private inferDataType(tool: string, result: any): string {
    if (tool.includes('headcount') || tool.includes('employee')) return 'employee_data';
    if (tool.includes('payroll') || tool.includes('salary')) return 'payroll_data';
    if (tool.includes('document') || tool.includes('pdf')) return 'document_data';
    if (tool.includes('performance') || tool.includes('kpi')) return 'performance_data';
    return 'generic_data';
  }

  private assessQuality(result: any, dataType: string): number {
    const criteria = this.QUALITY_CRITERIA[dataType];
    if (!criteria) return 75; // Default score for unknown data types
    
    return criteria.completeness(result);
  }

  private assessConsistency(result: any, dataType: string, plan: ExecutionPlan): number {
    const criteria = this.QUALITY_CRITERIA[dataType];
    if (!criteria) return 75;
    
    const previousResults = plan.steps
      .filter(s => s.status === 'completed' && s.result)
      .map(s => s.result);
    
    return criteria.consistency(result, previousResults);
  }

  private assessAccuracy(result: any, dataType: string, step: PlanStep): number {
    const criteria = this.QUALITY_CRITERIA[dataType];
    if (!criteria) return 75;
    
    return criteria.accuracy(result, { step });
  }

  private identifyIssues(result: any, dataType: string, scores: {
    quality: number;
    consistency: number;
    accuracy: number;
  }): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Quality issues
    if (scores.quality < 60) {
      issues.push({
        type: 'quality',
        severity: scores.quality < 40 ? 'critical' : 'high',
        description: 'Data quality is below acceptable standards',
        affectedData: ['completeness', 'structure'],
        suggestedFix: 'Improve data collection and validation processes'
      });
    }

    // Consistency issues
    if (scores.consistency < 50) {
      issues.push({
        type: 'consistency',
        severity: 'high',
        description: 'Results are inconsistent with previous data',
        affectedData: ['historical_comparison'],
        suggestedFix: 'Review data sources and calculation methods'
      });
    }

    // Accuracy issues
    if (scores.accuracy < 60) {
      issues.push({
        type: 'accuracy',
        severity: scores.accuracy < 40 ? 'critical' : 'medium',
        description: 'Data accuracy is questionable',
        affectedData: ['calculations', 'validations'],
        suggestedFix: 'Verify calculations and data sources'
      });
    }

    return issues;
  }

  private validateCrossModuleConsistency(
    module1: ModuleType,
    results1: AuditResult[],
    module2: ModuleType,
    results2: AuditResult[]
  ): CrossModuleValidation {
    const contradictions: string[] = [];
    let consistencyScore = 85; // Default

    // Check for specific cross-module consistencies
    if (module1 === 'employees' && module2 === 'payroll') {
      // Employee count should match payroll records
      const empResult = results1.find(r => r.tool.includes('headcount'));
      const payrollResult = results2.find(r => r.tool.includes('payroll'));
      
      if (empResult && payrollResult) {
        // Add specific consistency checks here
        consistencyScore = 90; // Placeholder
      }
    }

    return {
      modules: [module1, module2],
      metrics: ['employee_count', 'financial_data'],
      expectedConsistency: 85,
      actualConsistency: consistencyScore,
      contradictions,
      resolutionStrategy: contradictions.length > 0 
        ? 'Reconcile data sources and recalculate affected metrics'
        : 'No action required'
    };
  }

  private groupResultsByModule(auditResults: AuditResult[]): Record<string, AuditResult[]> {
    return auditResults.reduce((acc, result) => {
      if (!acc[result.module]) acc[result.module] = [];
      acc[result.module].push(result);
      return acc;
    }, {} as Record<string, AuditResult[]>);
  }

  private generateRecommendations(
    auditResults: AuditResult[],
    crossModuleValidations: CrossModuleValidation[]
  ): string[] {
    const recommendations: string[] = [];

    // From audit results
    auditResults.forEach(audit => {
      recommendations.push(...audit.recommendations);
    });

    // From cross-module validations
    crossModuleValidations.forEach(validation => {
      if (validation.contradictions.length > 0) {
        recommendations.push(`Resolve contradictions between ${validation.modules.join(' and ')} modules`);
      }
    });

    // Remove duplicates and return
    return [...new Set(recommendations)];
  }

  private generateStepRecommendations(step: PlanStep, issues: AuditIssue[]): string[] {
    const recommendations: string[] = [];

    issues.forEach(issue => {
      recommendations.push(issue.suggestedFix);
    });

    if (recommendations.length === 0) {
      recommendations.push('Results meet quality standards');
    }

    return recommendations;
  }

  private calculateAuditConfidence(overallScore: number, issueCount: number): number {
    let confidence = overallScore;
    confidence -= issueCount * 5; // Reduce confidence for each issue
    return Math.max(0, Math.min(100, confidence));
  }

  public async generateReplanningStrategy(
    originalPlan: ExecutionPlan,
    auditResults: AuditResult[]
  ): Promise<{
    strategy: string;
    modifiedSteps: PlanStep[];
    additionalSteps: PlanStep[];
    removedSteps: string[];
    reasoning: string[];
  }> {
    const failedSteps = auditResults.filter(audit => audit.needsReplanning);
    const modifiedSteps: PlanStep[] = [];
    const additionalSteps: PlanStep[] = [];
    const removedSteps: string[] = [];
    const reasoning: string[] = [];

    failedSteps.forEach(audit => {
      const originalStep = originalPlan.steps.find(s => s.id === audit.stepId);
      if (originalStep) {
        // Modify step parameters based on audit findings
        const modifiedStep: PlanStep = {
          ...originalStep,
          parameters: {
            ...originalStep.parameters,
            validation_level: 'high',
            quality_check: true
          },
          priority: 'critical' // Increase priority for corrected steps
        };
        
        modifiedSteps.push(modifiedStep);
        reasoning.push(`Modified ${originalStep.name} to address ${audit.issues.map(i => i.type).join(', ')} issues`);
      }
    });

    return {
      strategy: 'Enhanced validation and correction',
      modifiedSteps,
      additionalSteps,
      removedSteps,
      reasoning
    };
  }
}