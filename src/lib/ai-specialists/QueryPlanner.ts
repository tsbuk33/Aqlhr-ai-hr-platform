import { ModuleType } from './QueryGatekeeper';
import { AISpecialist } from './AISpecialistRegistry';

export interface PlanStep {
  id: string;
  name: string;
  description: string;
  tool: string;
  module: ModuleType;
  parameters: Record<string, any>;
  dependencies: string[]; // Step IDs this step depends on
  estimatedTime: number; // in seconds
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
}

export interface ExecutionPlan {
  id: string;
  query: string;
  objective: string;
  targetModule: ModuleType;
  specialist?: AISpecialist;
  steps: PlanStep[];
  estimatedTotalTime: number;
  complexity: 'simple' | 'moderate' | 'complex' | 'advanced';
  confidence: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: 'draft' | 'ready' | 'executing' | 'completed' | 'failed';
  summary?: string;
}

export interface PlanningContext {
  tenantId?: string;
  userId?: string;
  module?: ModuleType;
  availableTools: string[];
  dataAccess: string[];
  timeConstraints?: number;
  qualityRequirements?: string[];
}

export class QueryPlanner {
  private static instance: QueryPlanner;
  
  // Tool capabilities mapping
  private readonly TOOL_CAPABILITIES: Record<string, {
    module: ModuleType[];
    capabilities: string[];
    estimatedTime: number;
    complexity: number;
  }> = {
    'get_headcount': {
      module: ['employees'],
      capabilities: ['employee_count', 'active_employees', 'department_breakdown'],
      estimatedTime: 2,
      complexity: 1
    },
    'get_saudization': {
      module: ['employees', 'compliance'],
      capabilities: ['saudization_rate', 'nationality_breakdown', 'compliance_status'],
      estimatedTime: 3,
      complexity: 2
    },
    'create_task': {
      module: ['analytics', 'performance'],
      capabilities: ['task_creation', 'workflow_automation', 'assignment'],
      estimatedTime: 1,
      complexity: 1
    },
    'export_cci_pdf': {
      module: ['documents', 'compliance'],
      capabilities: ['pdf_generation', 'compliance_report', 'document_export'],
      estimatedTime: 5,
      complexity: 2
    },
    'find_document': {
      module: ['documents'],
      capabilities: ['document_search', 'file_retrieval', 'content_analysis'],
      estimatedTime: 2,
      complexity: 1
    },
    'analyze_performance': {
      module: ['performance', 'analytics'],
      capabilities: ['performance_analysis', 'kpi_calculation', 'trend_analysis'],
      estimatedTime: 4,
      complexity: 3
    },
    'process_payroll': {
      module: ['payroll'],
      capabilities: ['salary_calculation', 'deduction_processing', 'report_generation'],
      estimatedTime: 6,
      complexity: 3
    },
    'recruitment_analysis': {
      module: ['recruitment', 'analytics'],
      capabilities: ['candidate_screening', 'hiring_metrics', 'pipeline_analysis'],
      estimatedTime: 5,
      complexity: 3
    },
    'attendance_report': {
      module: ['attendance', 'analytics'],
      capabilities: ['attendance_tracking', 'absence_analysis', 'schedule_optimization'],
      estimatedTime: 3,
      complexity: 2
    },
    'training_assessment': {
      module: ['training', 'performance'],
      capabilities: ['skill_assessment', 'training_gaps', 'development_planning'],
      estimatedTime: 4,
      complexity: 3
    }
  };

  // Common query patterns and their planning templates
  private readonly QUERY_PATTERNS: Record<string, {
    keywords: string[];
    planningTemplate: Partial<ExecutionPlan>;
    defaultSteps: Omit<PlanStep, 'id' | 'status' | 'dependencies'>[];
  }> = {
    'employee_count': {
      keywords: ['how many', 'count', 'employees', 'staff', 'headcount'],
      planningTemplate: {
        objective: 'Retrieve employee count and breakdown',
        complexity: 'simple'
      },
      defaultSteps: [
        {
          name: 'Fetch Employee Data',
          description: 'Retrieve current employee count and status breakdown',
          tool: 'get_headcount',
          module: 'employees',
          parameters: {},
          estimatedTime: 2,
          priority: 'critical'
        }
      ]
    },
    'saudization_analysis': {
      keywords: ['saudization', 'saudi', 'nationality', 'nitaqat', 'compliance'],
      planningTemplate: {
        objective: 'Analyze Saudization compliance and rates',
        complexity: 'moderate'
      },
      defaultSteps: [
        {
          name: 'Fetch Saudization Data',
          description: 'Retrieve current Saudization rates and breakdown',
          tool: 'get_saudization',
          module: 'compliance',
          parameters: {},
          estimatedTime: 3,
          priority: 'critical'
        },
        {
          name: 'Analyze Compliance Status',
          description: 'Evaluate compliance with Nitaqat requirements',
          tool: 'analyze_performance',
          module: 'compliance',
          parameters: { type: 'saudization_compliance' },
          estimatedTime: 4,
          priority: 'high'
        }
      ]
    },
    'comprehensive_report': {
      keywords: ['report', 'comprehensive', 'analysis', 'overview', 'dashboard'],
      planningTemplate: {
        objective: 'Generate comprehensive HR analysis report',
        complexity: 'complex'
      },
      defaultSteps: [
        {
          name: 'Gather Employee Data',
          description: 'Collect current employee statistics',
          tool: 'get_headcount',
          module: 'employees',
          parameters: {},
          estimatedTime: 2,
          priority: 'critical'
        },
        {
          name: 'Analyze Saudization',
          description: 'Evaluate Saudization compliance',
          tool: 'get_saudization',
          module: 'compliance',
          parameters: {},
          estimatedTime: 3,
          priority: 'high'
        },
        {
          name: 'Performance Analysis',
          description: 'Analyze overall performance metrics',
          tool: 'analyze_performance',
          module: 'performance',
          parameters: { scope: 'organization' },
          estimatedTime: 4,
          priority: 'high'
        },
        {
          name: 'Generate Report',
          description: 'Compile comprehensive PDF report',
          tool: 'export_cci_pdf',
          module: 'documents',
          parameters: { type: 'comprehensive' },
          estimatedTime: 5,
          priority: 'medium'
        }
      ]
    }
  };

  public static getInstance(): QueryPlanner {
    if (!QueryPlanner.instance) {
      QueryPlanner.instance = new QueryPlanner();
    }
    return QueryPlanner.instance;
  }

  public async createExecutionPlan(
    query: string,
    targetModule: ModuleType,
    context?: PlanningContext
  ): Promise<ExecutionPlan> {
    const planId = this.generatePlanId();
    const normalizedQuery = query.toLowerCase();

    // Identify query pattern
    const pattern = this.identifyQueryPattern(normalizedQuery);
    
    // Create base plan
    const basePlan: ExecutionPlan = {
      id: planId,
      query,
      objective: pattern?.planningTemplate.objective || this.extractObjective(query),
      targetModule,
      steps: [],
      estimatedTotalTime: 0,
      complexity: pattern?.planningTemplate.complexity || this.assessComplexity(query),
      confidence: this.calculatePlanningConfidence(query, targetModule, context),
      createdAt: new Date(),
      status: 'draft'
    };

    // Generate steps based on pattern or custom analysis
    const steps = pattern 
      ? this.createStepsFromPattern(pattern, context)
      : await this.createCustomSteps(query, targetModule, context);

    // Add dependencies and optimize step order
    const optimizedSteps = this.optimizeStepOrder(steps);
    
    // Calculate total estimated time
    const totalTime = optimizedSteps.reduce((sum, step) => sum + step.estimatedTime, 0);

    return {
      ...basePlan,
      steps: optimizedSteps,
      estimatedTotalTime: totalTime,
      status: 'ready'
    };
  }

  public async executePlan(plan: ExecutionPlan): Promise<ExecutionPlan> {
    const executingPlan = { ...plan, status: 'executing' as const, startedAt: new Date() };
    
    try {
      // Execute steps in dependency order
      const stepResults = new Map<string, any>();
      
      for (const step of executingPlan.steps) {
        // Check if dependencies are met
        const dependenciesCompleted = step.dependencies.every(depId => 
          stepResults.has(depId)
        );

        if (!dependenciesCompleted) {
          step.status = 'skipped';
          continue;
        }

        // Execute step
        step.status = 'running';
        
        try {
          const result = await this.executeStep(step, stepResults);
          step.result = result;
          step.status = 'completed';
          stepResults.set(step.id, result);
        } catch (error) {
          step.error = error instanceof Error ? error.message : 'Unknown error';
          step.status = 'failed';
          
          // Decide whether to continue or abort based on step priority
          if (step.priority === 'critical') {
            throw new Error(`Critical step failed: ${step.name}`);
          }
        }
      }

      return {
        ...executingPlan,
        status: 'completed',
        completedAt: new Date(),
        summary: this.generateExecutionSummary(executingPlan)
      };
    } catch (error) {
      return {
        ...executingPlan,
        status: 'failed',
        completedAt: new Date(),
        summary: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private identifyQueryPattern(query: string): typeof this.QUERY_PATTERNS[string] | null {
    for (const [patternName, pattern] of Object.entries(this.QUERY_PATTERNS)) {
      const matchCount = pattern.keywords.filter(keyword => 
        query.includes(keyword)
      ).length;
      
      if (matchCount >= 2) {
        return pattern;
      }
    }
    return null;
  }

  private extractObjective(query: string): string {
    // Simple objective extraction based on query analysis
    if (query.includes('how many') || query.includes('count')) {
      return 'Count and analyze requested data';
    }
    if (query.includes('generate') || query.includes('create')) {
      return 'Generate requested content or reports';
    }
    if (query.includes('analyze') || query.includes('analysis')) {
      return 'Perform detailed analysis of requested data';
    }
    if (query.includes('find') || query.includes('search')) {
      return 'Search and retrieve requested information';
    }
    return 'Process and respond to user request';
  }

  private assessComplexity(query: string): ExecutionPlan['complexity'] {
    const complexityIndicators = {
      simple: ['count', 'show', 'get', 'find'],
      moderate: ['analyze', 'calculate', 'compare', 'report'],
      complex: ['comprehensive', 'detailed', 'complete', 'full'],
      advanced: ['predict', 'forecast', 'optimize', 'recommend']
    };

    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => query.includes(indicator))) {
        return level as ExecutionPlan['complexity'];
      }
    }
    
    return 'simple';
  }

  private calculatePlanningConfidence(
    query: string, 
    targetModule: ModuleType, 
    context?: PlanningContext
  ): number {
    let confidence = 70; // Base confidence

    // Boost confidence if we have clear patterns
    if (this.identifyQueryPattern(query.toLowerCase())) {
      confidence += 20;
    }

    // Boost confidence if context is provided
    if (context?.tenantId) confidence += 5;
    if (context?.userId) confidence += 5;
    if (context?.availableTools?.length) confidence += 10;

    return Math.min(100, confidence);
  }

  private createStepsFromPattern(
    pattern: typeof this.QUERY_PATTERNS[string], 
    context?: PlanningContext
  ): PlanStep[] {
    return pattern.defaultSteps.map((stepTemplate, index) => ({
      ...stepTemplate,
      id: `step_${index + 1}`,
      status: 'pending' as const,
      dependencies: index > 0 ? [`step_${index}`] : []
    }));
  }

  private async createCustomSteps(
    query: string, 
    targetModule: ModuleType, 
    context?: PlanningContext
  ): Promise<PlanStep[]> {
    // Analyze query and create custom steps
    const steps: PlanStep[] = [];
    const availableTools = Object.entries(this.TOOL_CAPABILITIES)
      .filter(([_, cap]) => cap.module.includes(targetModule));

    if (availableTools.length === 0) {
      // Fallback step
      steps.push({
        id: 'step_1',
        name: 'Process Request',
        description: `Process request for ${targetModule} module`,
        tool: 'enhanced-aqlhr-ai', // Default AI tool
        module: targetModule,
        parameters: { query },
        dependencies: [],
        estimatedTime: 3,
        priority: 'critical',
        status: 'pending'
      });
    } else {
      // Create steps based on available tools
      availableTools.forEach(([toolName, toolCap], index) => {
        steps.push({
          id: `step_${index + 1}`,
          name: `Execute ${toolName}`,
          description: `Use ${toolName} to process request`,
          tool: toolName,
          module: targetModule,
          parameters: this.inferParameters(query, toolName),
          dependencies: index > 0 ? [`step_${index}`] : [],
          estimatedTime: toolCap.estimatedTime,
          priority: index === 0 ? 'critical' : 'high',
          status: 'pending'
        });
      });
    }

    return steps;
  }

  private optimizeStepOrder(steps: PlanStep[]): PlanStep[] {
    // Sort steps by priority and dependencies
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    
    return steps.sort((a, b) => {
      // First by dependencies (steps with no deps come first)
      if (a.dependencies.length !== b.dependencies.length) {
        return a.dependencies.length - b.dependencies.length;
      }
      
      // Then by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private async executeStep(step: PlanStep, previousResults: Map<string, any>): Promise<any> {
    // This would integrate with the actual tool execution system
    // For now, return a mock result
    await new Promise(resolve => setTimeout(resolve, step.estimatedTime * 100)); // Simulate execution time
    
    return {
      stepId: step.id,
      tool: step.tool,
      result: `Mock result for ${step.name}`,
      executionTime: step.estimatedTime,
      timestamp: new Date().toISOString()
    };
  }

  private inferParameters(query: string, toolName: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract common parameters from query
    const numberMatch = query.match(/\d+/);
    if (numberMatch) {
      params.limit = parseInt(numberMatch[0]);
    }
    
    if (query.includes('last month')) {
      params.period = 'last_month';
    } else if (query.includes('this year')) {
      params.period = 'this_year';
    }
    
    if (query.includes('department')) {
      params.groupBy = 'department';
    }
    
    return params;
  }

  private generateExecutionSummary(plan: ExecutionPlan): string {
    const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
    const failedSteps = plan.steps.filter(s => s.status === 'failed').length;
    const totalSteps = plan.steps.length;
    
    return `Execution completed: ${completedSteps}/${totalSteps} steps successful, ${failedSteps} failed. Total time: ${plan.estimatedTotalTime}s`;
  }

  private generatePlanId(): string {
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}