import { AISpecialist } from './AISpecialistRegistry';

export type ModuleType = 'employees' | 'recruitment' | 'payroll' | 'compliance' | 'performance' | 'training' | 'attendance' | 'documents' | 'analytics';

export interface QueryValidationResult {
  isValid: boolean;
  clarity: number; // 0-100 score
  specificity: number; // 0-100 score
  confidence: number; // 0-100 score
  missingContext: string[];
  suggestedClarifications: string[];
  validatedQuery?: string;
  targetModule?: ModuleType;
  recommendedSpecialist?: AISpecialist;
}

export interface ClarificationRequest {
  originalQuery: string;
  issues: string[];
  suggestedQuestions: string[];
  examples: string[];
}

export class QueryGatekeeper {
  private static instance: QueryGatekeeper;
  
  private readonly CLARITY_THRESHOLD = 70;
  private readonly SPECIFICITY_THRESHOLD = 60;
  private readonly CONFIDENCE_THRESHOLD = 75;

  private readonly MODULE_KEYWORDS: Record<ModuleType, string[]> = {
    employees: ['employee', 'staff', 'worker', 'personnel', 'headcount', 'saudization', 'hire', 'resign'],
    recruitment: ['recruit', 'candidate', 'interview', 'application', 'job', 'position', 'vacancy'],
    payroll: ['salary', 'wage', 'pay', 'compensation', 'benefit', 'allowance', 'deduction', 'overtime'],
    compliance: ['compliance', 'regulation', 'law', 'policy', 'audit', 'violation', 'legal', 'nitaqat'],
    performance: ['performance', 'kpi', 'review', 'evaluation', 'goal', 'objective', 'rating', 'appraisal'],
    training: ['training', 'course', 'skill', 'development', 'learning', 'certification', 'education'],
    attendance: ['attendance', 'leave', 'absence', 'vacation', 'time', 'shift', 'schedule', 'clock'],
    documents: ['document', 'file', 'report', 'certificate', 'contract', 'agreement', 'form'],
    analytics: ['analysis', 'report', 'dashboard', 'metric', 'trend', 'insight', 'data', 'statistics']
  };

  private readonly VAGUE_INDICATORS = [
    'some', 'few', 'many', 'various', 'several', 'different', 'stuff', 'things', 
    'information', 'data', 'details', 'help', 'assist', 'general', 'overview'
  ];

  private readonly SPECIFIC_INDICATORS = [
    'how many', 'what is', 'when did', 'where is', 'who are', 'which', 
    'calculate', 'show me', 'list', 'find', 'generate', 'create', 'update'
  ];

  public static getInstance(): QueryGatekeeper {
    if (!QueryGatekeeper.instance) {
      QueryGatekeeper.instance = new QueryGatekeeper();
    }
    return QueryGatekeeper.instance;
  }

  public async validateQuery(
    query: string, 
    context?: any,
    userId?: string,
    tenantId?: string
  ): Promise<QueryValidationResult> {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Calculate clarity score
    const clarity = this.calculateClarity(normalizedQuery);
    
    // Calculate specificity score
    const specificity = this.calculateSpecificity(normalizedQuery);
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(normalizedQuery, context);
    
    // Identify missing context
    const missingContext = this.identifyMissingContext(normalizedQuery);
    
    // Generate clarification suggestions
    const suggestedClarifications = this.generateClarifications(normalizedQuery, missingContext);
    
    // Determine target module
    const targetModule = this.identifyTargetModule(normalizedQuery);
    
    // Check if query meets thresholds
    const isValid = clarity >= this.CLARITY_THRESHOLD && 
                   specificity >= this.SPECIFICITY_THRESHOLD && 
                   confidence >= this.CONFIDENCE_THRESHOLD;

    return {
      isValid,
      clarity,
      specificity,
      confidence,
      missingContext,
      suggestedClarifications,
      validatedQuery: isValid ? query : undefined,
      targetModule,
      recommendedSpecialist: targetModule ? this.getSpecialistForModule(targetModule) : undefined
    };
  }

  public generateClarificationRequest(
    query: string, 
    validationResult: QueryValidationResult
  ): ClarificationRequest {
    const issues: string[] = [];
    const suggestedQuestions: string[] = [];
    const examples: string[] = [];

    // Identify specific issues
    if (validationResult.clarity < this.CLARITY_THRESHOLD) {
      issues.push('Your question is not clear enough');
      suggestedQuestions.push('Could you rephrase your question more specifically?');
    }

    if (validationResult.specificity < this.SPECIFICITY_THRESHOLD) {
      issues.push('Your question lacks specific details');
      suggestedQuestions.push('What specific information are you looking for?');
    }

    if (validationResult.missingContext.length > 0) {
      issues.push(`Missing context: ${validationResult.missingContext.join(', ')}`);
      validationResult.missingContext.forEach(context => {
        suggestedQuestions.push(`Could you specify the ${context}?`);
      });
    }

    // Generate examples based on target module
    if (validationResult.targetModule) {
      examples.push(...this.getExamplesForModule(validationResult.targetModule));
    }

    return {
      originalQuery: query,
      issues,
      suggestedQuestions,
      examples
    };
  }

  private calculateClarity(query: string): number {
    let score = 50; // Base score
    
    // Penalize vague words
    const vagueness = this.VAGUE_INDICATORS.filter(indicator => 
      query.includes(indicator)
    ).length;
    score -= vagueness * 10;
    
    // Reward specific words
    const specificity = this.SPECIFIC_INDICATORS.filter(indicator => 
      query.includes(indicator)
    ).length;
    score += specificity * 15;
    
    // Reward question words
    const questionWords = ['what', 'how', 'when', 'where', 'who', 'why', 'which'];
    const hasQuestionWord = questionWords.some(word => query.includes(word));
    if (hasQuestionWord) score += 20;
    
    // Penalize very short queries
    if (query.split(' ').length < 3) score -= 20;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateSpecificity(query: string): number {
    let score = 40; // Base score
    
    // Check for specific entities (numbers, dates, names)
    const hasNumbers = /\d+/.test(query);
    const hasDates = /\b(today|yesterday|tomorrow|last|next|month|year|2024|2025)\b/.test(query);
    const hasNames = /\b[A-Z][a-z]+\b/.test(query);
    
    if (hasNumbers) score += 20;
    if (hasDates) score += 15;
    if (hasNames) score += 10;
    
    // Check for action words
    const actionWords = ['calculate', 'show', 'list', 'find', 'create', 'update', 'delete', 'generate'];
    const hasAction = actionWords.some(action => query.includes(action));
    if (hasAction) score += 25;
    
    // Check for module-specific terms
    const moduleTermCount = Object.values(this.MODULE_KEYWORDS)
      .flat()
      .filter(keyword => query.includes(keyword))
      .length;
    score += Math.min(20, moduleTermCount * 5);
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateConfidence(query: string, context?: any): number {
    let score = 60; // Base score
    
    // Boost if context is provided
    if (context) {
      if (context.tenantId) score += 10;
      if (context.userId) score += 10;
      if (context.module) score += 15;
    }
    
    // Check query completeness
    const words = query.split(' ');
    if (words.length >= 5) score += 10;
    if (words.length >= 10) score += 5;
    
    // Check for complete sentence structure
    const hasSubject = /\b(I|you|we|they|employee|staff|system)\b/i.test(query);
    const hasVerb = /\b(is|are|was|were|do|does|did|can|will|should|need|want|show|get|find)\b/i.test(query);
    
    if (hasSubject && hasVerb) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  private identifyMissingContext(query: string): string[] {
    const missing: string[] = [];
    
    // Check for common missing context
    if (query.includes('employee') && !query.includes('which') && !query.includes('specific')) {
      missing.push('specific employee or employee criteria');
    }
    
    if (query.includes('report') && !query.includes('type') && !query.includes('kind')) {
      missing.push('report type or format');
    }
    
    if (query.includes('data') && !query.includes('what') && !query.includes('which')) {
      missing.push('specific data fields or metrics');
    }
    
    if ((query.includes('last') || query.includes('recent')) && !query.includes('month') && !query.includes('year')) {
      missing.push('time period specification');
    }
    
    return missing;
  }

  private generateClarifications(query: string, missingContext: string[]): string[] {
    const clarifications: string[] = [];
    
    // Generate specific clarifications based on missing context
    missingContext.forEach(context => {
      switch (context) {
        case 'specific employee or employee criteria':
          clarifications.push('Which employee or what employee criteria (department, position, etc.)?');
          break;
        case 'report type or format':
          clarifications.push('What type of report do you need (PDF, Excel, summary)?');
          break;
        case 'specific data fields or metrics':
          clarifications.push('Which specific data or metrics are you interested in?');
          break;
        case 'time period specification':
          clarifications.push('What time period are you referring to (last month, quarter, year)?');
          break;
        default:
          clarifications.push(`Please specify: ${context}`);
      }
    });
    
    // Add general clarifications if none specific
    if (clarifications.length === 0) {
      clarifications.push('Could you provide more specific details about what you need?');
      clarifications.push('What specific action would you like me to perform?');
    }
    
    return clarifications;
  }

  private identifyTargetModule(query: string): ModuleType | undefined {
    let bestMatch: ModuleType | undefined;
    let maxMatches = 0;
    
    Object.entries(this.MODULE_KEYWORDS).forEach(([module, keywords]) => {
      const matches = keywords.filter(keyword => query.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = module as ModuleType;
      }
    });
    
    return maxMatches > 0 ? bestMatch : undefined;
  }

  private getSpecialistForModule(module: ModuleType): AISpecialist | undefined {
    // This would integrate with the AISpecialistRegistry
    return {
      id: `${module}-specialist`,
      name: `${module.charAt(0).toUpperCase() + module.slice(1)} Specialist`,
      module,
      description: `AI specialist for ${module} operations`,
      capabilities: [],
      aiTools: [],
      expertise: [],
      language: 'both' as const,
      status: 'active' as const,
      lastUpdated: new Date().toISOString()
    };
  }

  private getExamplesForModule(module: ModuleType): string[] {
    const examples: Record<ModuleType, string[]> = {
      employees: [
        'How many active employees do we have?',
        'What is our current Saudization rate?',
        'Show me employees in the IT department'
      ],
      recruitment: [
        'How many open positions do we have?',
        'Show me candidates for the Marketing Manager role',
        'What is our average time to hire?'
      ],
      payroll: [
        'Calculate overtime for last month',
        'Show me salary breakdown for employee ID 123',
        'What is the total payroll cost for Q4?'
      ],
      compliance: [
        'Check our Nitaqat compliance status',
        'Show me employees with expiring Iqamas',
        'Generate a compliance audit report'
      ],
      performance: [
        'Show me performance ratings for Q4',
        'Which employees need performance reviews?',
        'Calculate team performance metrics'
      ],
      training: [
        'Show me training completion rates',
        'Which employees need safety training?',
        'Generate a skills gap analysis'
      ],
      attendance: [
        'Show me attendance report for last month',
        'Which employees have excessive absences?',
        'Calculate average working hours per employee'
      ],
      documents: [
        'Find employment contracts for new hires',
        'Show me documents expiring this month',
        'Generate an employee handbook PDF'
      ],
      analytics: [
        'Show me HR dashboard metrics',
        'Generate turnover analysis report',
        'What are our key HR trends?'
      ]
    };
    
    return examples[module] || [];
  }
}